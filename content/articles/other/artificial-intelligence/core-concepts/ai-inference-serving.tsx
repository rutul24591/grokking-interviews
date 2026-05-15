"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-ai-inference-serving",
  title: "AI Inference Serving — vLLM, TGI, and Production LLM Deployment",
  description:
    "Comprehensive guide to AI inference serving covering vLLM, Text Generation Inference, TensorRT-LLM, continuous batching, PagedAttention, KV cache management, quantization formats in serving, GPU scheduling, and throughput optimization for production LLM deployments.",
  category: "other",
  subcategory: "artificial-intelligence",
  slug: "ai-inference-serving",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-05-15",
  tags: ["ai", "inference", "vllm", "tgi", "gpu", "serving", "llm"],
  relatedTopics: [
    "ai-model-deployment",
    "large-language-models",
    "ai-cost-management",
    "tokens",
  ],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: inference serving is distinct from model training —
          it is the runtime system that takes a trained model and serves
          predictions at scale under latency and throughput SLOs. The key
          design variables are GPU memory (KV cache vs weights), request
          scheduling (continuous vs static batching), and the trade-off between
          TTFT (time-to-first-token) and TPS (tokens per second after first
          token).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>AI inference serving</strong> refers to the systems and
          infrastructure responsible for running a trained language model and
          returning predictions to users or downstream services in production.
          Unlike training, which is a one-time (or periodic) batch process,
          inference serving must handle concurrent user requests in real time,
          meet latency SLOs, and optimize hardware utilization to keep cost
          per token low. The field has evolved dramatically since 2022: naive
          inference using plain PyTorch with static batching is typically 10 to
          100 times less efficient than optimized serving frameworks like vLLM
          or TGI. For an engineering team running a 70B parameter model, the
          difference between naive and optimized serving can mean the difference
          between needing 16 A100 GPUs and needing 4.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Two latency dimensions define the user experience and SLO structure
          for LLM serving. <strong>TTFT (time-to-first-token)</strong> measures
          how long the user waits before seeing any output — this is driven
          almost entirely by the prefill phase, which scales with prompt length.
          <strong> TPS (tokens per second)</strong> measures how quickly tokens
          stream after the first one — this is driven by the decode phase and
          is constrained by memory bandwidth. Most products have separate SLOs
          for each: TTFT might be targeted at under 500 ms for a chat product,
          while TPS might be targeted at 30 tokens per second to match reading
          speed. Conflating these two metrics leads to poorly tuned serving
          configurations.
        </HighlightBlock>
        <p>
          Before specialized inference servers existed, teams deployed LLMs
          using raw Hugging Face{" "}
          <code>transformers</code> with a simple Flask or FastAPI wrapper. This
          approach processed one request at a time, left the GPU idle while the
          CPU assembled the next batch, and pre-allocated worst-case memory for
          every request whether it needed it or not. The consequence was GPU
          utilization often below 30% and throughput measured in requests per
          minute rather than per second. The engineering innovations in modern
          inference serving — continuous batching, paged attention, prefix
          caching, speculative decoding — collectively address this gap and
          represent the most impactful systems-level work in applied AI
          infrastructure today.
        </p>
        <p>
          For software engineers building AI-powered products, inference serving
          is the boundary between the model (which you may not control) and your
          application (which you do). Understanding how the serving layer works
          lets you make smarter decisions: whether to self-host a model or use
          an API, how to set realistic SLOs, how to estimate GPU costs, how to
          identify serving bottlenecks when latency spikes, and how to choose
          between frameworks like vLLM, TGI, and TensorRT-LLM for your specific
          workload.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: be able to explain continuous batching from first
          principles — why static batching wastes GPU resources, and how
          iteration-level scheduling eliminates that waste. Then explain
          PagedAttention as the memory management innovation that makes
          continuous batching practical.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          LLM text generation consists of two fundamentally different
          computational phases. The <strong>prefill phase</strong> processes all
          prompt tokens in a single forward pass through the model — it is
          compute-bound, parallelizes across all tokens simultaneously, and
          produces the key-value (KV) tensors for every attention layer that
          will be needed during generation. The{" "}
          <strong>decode phase</strong> generates one new token per forward
          pass, querying the cached KV tensors from the prefill to compute
          attention over the full context. The decode phase is memory-bandwidth
          bound: the GPU must load the entire model weight matrix and all cached
          KV tensors for every single token generated. This asymmetry — fast
          compute in prefill, slow memory access in decode — is the central
          constraint of LLM inference architecture.
        </HighlightBlock>
        <p>
          <strong>Static batching</strong>, the naive approach, works like a
          synchronous batch job: the server collects a set of requests, runs
          them through the model together, and waits for the longest request
          in the batch to finish before accepting new requests. This means
          every GPU in the cluster is idle whenever a short request finishes
          while waiting for longer requests to complete. If your batch contains
          10 requests of 50 tokens and one request of 500 tokens, the GPU is
          underutilized for roughly 90% of the decode phase.{" "}
          <strong>Continuous batching</strong>, introduced by the Orca paper
          (2022) and popularized by vLLM, replaces batch-level scheduling with
          iteration-level scheduling. At every decode step (every single token
          generated), the scheduler checks whether any completed request has
          freed a slot and, if so, immediately schedules a new request into that
          slot. The batch composition changes dynamically with every token — a
          new request joins mid-generation once space is available. This
          eliminates idle GPU time and typically achieves 10 to 30 times higher
          throughput compared to static batching on the same hardware.
        </p>
        <p>
          <strong>PagedAttention</strong>, introduced by the vLLM paper (2023),
          solves the memory fragmentation problem that made continuous batching
          impractical. Without PagedAttention, each request&apos;s KV cache
          must be allocated as a single contiguous block of GPU memory,
          pre-allocated to the maximum possible sequence length. Since requests
          vary widely in actual length, up to 60% of pre-allocated KV memory
          was wasted on average. PagedAttention borrows the concept of virtual
          memory paging from operating systems: KV cache is divided into
          fixed-size blocks of 16 or 32 tokens. The system maintains a block
          table that maps each request&apos;s logical token positions to
          physical memory blocks, which do not need to be contiguous. Blocks
          are allocated on demand as each request generates tokens, and freed
          immediately when a request completes. This reduces KV cache memory
          waste from around 60% to under 4%, allowing the server to maintain
          far more concurrent requests in GPU memory.
        </p>
        <p>
          <strong>Prefix caching</strong> extends PagedAttention with a hash-
          based cache for KV blocks corresponding to common prompt prefixes.
          If a system prompt appears in 1,000 requests, the KV tensors for
          that system prompt are computed once, stored, and reused across all
          subsequent requests that share that prefix. Cache hit rates of 40
          to 80% are typical for chatbot workloads with consistent system
          prompts. Blocks are identified by hashing the token IDs they contain
          and are evicted using LRU policy when GPU memory is full.{" "}
          <strong>Speculative decoding</strong> is a complementary technique:
          a small, fast draft model generates several candidate tokens in
          parallel, and the larger target model verifies all candidates in
          a single forward pass. Since the target model can verify multiple
          tokens at once in a single prefill-style pass, accepted candidates
          cost less compute per token than sequential decoding. Typical
          acceptance rates of 60 to 80% yield 2 to 3x speedups in
          TTFT-sensitive scenarios.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: describe the full serving stack — from the load
          balancer through the request scheduler to GPU workers — and explain
          how tensor parallelism and pipeline parallelism split a model across
          multiple GPUs when it doesn&apos;t fit on one.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          A production inference serving stack has several layers. At the top,
          a load balancer distributes incoming requests across multiple serving
          instances. Each instance runs a{" "}
          <strong>request scheduler</strong> responsible for continuous batching
          decisions, KV cache allocation, and request preemption. Below the
          scheduler, one or more <strong>GPU workers</strong> execute the actual
          forward pass using distributed communication libraries (NCCL for
          NVIDIA GPUs) when the model spans multiple devices. Workers stream
          generated tokens back through the scheduler to the client via
          server-sent events or chunked HTTP responses.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/ai-inference-serving-architecture.svg"
          alt="AI inference serving architecture showing request scheduling, KV cache management, quantization options, and framework comparison"
          caption="Inference Serving Architecture — request scheduling, KV cache management, quantization, and framework comparison"
        />

        <p>
          For models that fit on a single GPU (up to roughly 13B parameters in
          FP16 on an 80GB A100), serving is straightforward: one process per
          GPU, the scheduler and worker run in the same process, and requests
          are served with full memory available for KV cache.{" "}
          <strong>Tensor parallelism (TP)</strong> is used when the model does
          not fit on a single GPU. In TP, each transformer layer is split
          horizontally across multiple GPUs: the weight matrices are sharded
          column-wise, each GPU computes a partial result, and an all-reduce
          operation combines the partial results across GPUs before the next
          layer. TP requires high-bandwidth interconnects (NVLink between GPUs)
          because every layer requires a synchronization step — it works well
          on a single server node with NVLink (8xA100 at 600 GB/s aggregate)
          but poorly across nodes where bandwidth drops to 100 GB/s Ethernet.
          A 70B model typically requires TP=4 (4xA100 80GB) or TP=8 for
          comfortable KV cache headroom.
        </p>
        <p>
          <strong>Pipeline parallelism (PP)</strong> is used for extremely large
          models (200B+ parameters) or when serving across multiple nodes.
          In PP, the model is split by layers: GPU 0 handles layers 1 to 20,
          GPU 1 handles layers 21 to 40, and so on. Each GPU runs a continuous
          stream of micro-batches, keeping all GPUs busy simultaneously via
          pipeline scheduling. The tradeoff is latency: a request must traverse
          all pipeline stages before completing, adding inter-node communication
          at each boundary. In practice, most teams combine TP and PP: TP within
          a node for fast intra-node communication, PP across nodes for scale-out.
        </p>
        <p>
          The KV cache lifecycle inside vLLM follows this sequence. When a
          request arrives, the scheduler checks whether the prompt&apos;s
          prefix matches any cached blocks — cache hits skip prefill for
          matched tokens. The remaining prefix is processed in the prefill
          phase, allocating new physical blocks for uncached KV tensors. During
          decode, one new physical block is allocated every 16 to 32 tokens.
          When a request finishes, all its physical blocks are freed. If GPU
          memory is exhausted during decode, the scheduler preempts
          lowest-priority requests: their KV blocks are either swapped to CPU
          RAM (costly) or discarded and recomputed later (cheaper if the
          request can tolerate latency). The block manager tracks reference
          counts for shared blocks (e.g., common prefix blocks shared across
          thousands of requests) and uses copy-on-write semantics when beam
          search requires diverging copies of a sequence.
        </p>
      </section>

      <section>
        <h2>Framework Comparison</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: choosing an inference framework is a build-vs-buy
          decision with three axes — throughput, operational complexity, and
          hardware support. Start with vLLM for most OSS models; use TGI if
          you need tighter Hugging Face Hub integration; use TensorRT-LLM only
          if you have dedicated NVIDIA hardware and need the last 20-40%
          performance improvement.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>vLLM</strong> (UC Berkeley, 2023) is the current default
          choice for self-hosting open-source LLMs. It provides PagedAttention,
          continuous batching, prefix caching, speculative decoding, OpenAI-
          compatible REST API, and broad model support (Llama, Mistral,
          Mixtral, Qwen, Gemma, etc.). Deployment is straightforward:{" "}
          <code>pip install vllm</code> and a single CLI command starts a
          server. vLLM&apos;s main limitation is that it is Python-first and
          has more overhead than CUDA-native solutions.
        </HighlightBlock>
        <p>
          <strong>Text Generation Inference (TGI)</strong>, maintained by
          Hugging Face, targets production reliability over raw throughput. TGI
          includes tensor parallelism, flash attention, speculative decoding,
          and tight integration with Hugging Face Hub for model loading. TGI is
          written in Rust (HTTP layer) with Python/PyTorch for model execution,
          giving it lower server-side overhead than pure Python solutions. TGI
          is the better choice when your organization already uses Hugging Face
          infrastructure, when you need enterprise support, or when you require
          fine-grained control over deployment configuration via its Docker
          image. TGI&apos;s throughput is comparable to vLLM for most workloads
          but historically lagged on batch sizes above 64 concurrent requests;
          recent versions have narrowed this gap.
        </p>
        <p>
          <strong>TensorRT-LLM</strong> (NVIDIA) achieves the highest raw
          throughput on NVIDIA A100 and H100 GPUs — typically 20 to 40%
          faster than vLLM — by compiling models into CUDA-optimized engines
          with kernel fusion, mixed-precision execution, and
          hardware-specific attention kernels. The cost is significant: model
          compilation takes 10 to 30 minutes per model and must be repeated
          for every model update or quantization change. TensorRT-LLM only
          runs on NVIDIA hardware, has slower model support for newly released
          architectures, and requires deep NVIDIA expertise to operate. It
          becomes the right choice at very high scale (tens of millions of
          requests per day) where the engineering cost of running TensorRT-LLM
          is justified by GPU cost savings.{" "}
          <strong>Ollama</strong> and <strong>llama.cpp</strong> serve
          completely different niches: developer laptops, edge devices, and
          CPU-only deployments. Ollama provides a polished developer experience
          for local model testing; llama.cpp achieves surprisingly good
          performance on Apple Silicon and consumer GPUs using GGUF quantized
          models. Neither is suitable for handling more than a handful of
          concurrent requests under production SLOs.
        </p>
      </section>

      <section>
        <h2>Quantization in Serving</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: quantization in serving is primarily about fitting
          larger models (or larger batches) into fixed GPU memory, not about
          compute speed. INT8 weight quantization halves model memory with
          under 1% quality loss. KV cache quantization further multiplies
          the number of concurrent requests you can serve.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Quantization reduces the numerical precision of model weights or
          activations, trading some model quality for reduced memory footprint
          and often faster inference. In serving, the primary motivation is
          memory: a 70B model in FP16 requires roughly 140 GB of GPU memory
          for weights alone, requiring a 2xA100 80GB setup with nothing left
          for KV cache. With INT4 quantization, the same model fits in ~35 GB,
          leaving substantial headroom for concurrent requests. The key
          calibration question is whether the quality degradation is acceptable
          for your specific task — a coding assistant may tolerate 1% pass@1
          degradation; a medical information assistant may not.
        </HighlightBlock>
        <p>
          <strong>Weight quantization</strong> schemes differ in their
          approach to minimizing quality loss. GPTQ (post-training
          quantization) uses a second-order optimization to minimize the
          layer-wise reconstruction error when rounding weights to INT4 or
          INT8. AWQ (Activation-aware Weight Quantization) observes that not
          all weights are equally important — weights that correspond to
          high-magnitude activations should be quantized more carefully — and
          protects the top 1% of weight channels from aggressive quantization.
          In practice, AWQ consistently outperforms GPTQ at the same bit width
          by 1 to 2 perplexity points. FP8 quantization (8-bit floating point)
          is the newest format, natively supported by H100 GPUs: it achieves
          weight memory reduction comparable to INT8 while retaining better
          dynamic range properties, typically with under 0.5% quality loss.
        </p>
        <p>
          <strong>KV cache quantization</strong> is orthogonal to weight
          quantization and targets the memory consumed by KV tensors during
          inference. Since the KV cache grows with batch size and sequence
          length — not model size — reducing KV precision directly increases
          the number of concurrent long-context requests you can serve. A
          70B model serving 100 concurrent requests with 4K context uses
          roughly 80 GB of KV cache in FP16; INT8 KV quantization halves
          this to 40 GB, effectively doubling concurrent capacity. vLLM
          supports INT8 and FP8 KV quantization via the{" "}
          <code>--kv-cache-dtype</code> flag. The practical workflow for
          production deployment: benchmark quality on INT8 KV against your
          task metrics, monitor perplexity on representative inputs, and
          treat quality regression as a hard stop criterion before enabling
          in production.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: the most common mistake is planning GPU memory
          only for model weights and forgetting KV cache overhead. Always
          budget: model weights + peak KV cache at max batch + overhead (CUDA
          context, activations). Set TTFT and TPS as separate SLOs with
          separate alerting thresholds.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          GPU memory planning is the most critical capacity engineering task
          for inference serving. The formula is:{" "}
          <em>
            total GPU memory = model weights + peak KV cache + CUDA overhead
          </em>
          . For a 70B model in FP16, weights use approximately 140 GB. A
          single A100 80GB can&apos;t hold the model; you need at least 2
          GPUs for weights alone. With TP=2 on 2xA100s (160 GB total), you
          have ~20 GB for KV cache — enough for approximately 20 concurrent
          requests at 4K context. To increase concurrency, either quantize
          weights (freeing more VRAM), quantize KV cache, or add more GPUs.
        </HighlightBlock>
        <p>
          Autoscaling inference workloads differs from autoscaling stateless
          services. The primary metric should be GPU KV cache utilization
          (how full is the KV cache memory), not CPU utilization or request
          queue depth. When KV cache utilization exceeds 80 to 85%, the
          server begins preempting requests, which causes latency spikes
          rather than clean queueing. Scale out before this threshold is
          reached. Because spinning up a new GPU instance takes 2 to 5
          minutes (model loading plus CUDA initialization), maintain a
          minimum fleet size that handles 60% of peak load even during
          off-peak hours. Use predictive scaling based on historical traffic
          patterns rather than purely reactive scaling.
        </p>
        <p>
          Monitoring an inference serving deployment requires tracking metrics
          across three layers. At the request layer: TTFT p50/p95/p99, TPS
          p50/p95, request error rate, and retry rate. At the scheduler layer:
          queue depth, preemption rate, prefix cache hit rate, and batch
          utilization. At the GPU layer: GPU memory utilization, GPU compute
          utilization (SM activity), KV cache bytes allocated, and NVLink
          bandwidth (for multi-GPU setups). TTFT p99 spikes almost always
          trace to either large prefill batches (scheduler is spending too
          long on prefill for new requests) or cache misses (cold starts with
          no prefix cache hits). TPS degradation traces to KV cache thrashing
          (too many concurrent long-context requests) or memory bandwidth
          saturation.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: the four most common production failures in
          inference serving are GPU OOM from KV cache exhaustion, TTFT
          spikes from prefill starvation, quantization quality regression
          discovered after deployment, and cold start latency from not
          pre-warming caches.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          GPU out-of-memory errors in inference serving almost never come
          from model weights — those are fixed and known at startup. They
          come from KV cache growth: a workload with unexpectedly long
          prompts, unexpectedly large batch sizes, or a slow increase in
          traffic that exhausts KV cache memory hours after deployment.
          vLLM&apos;s default behavior on KV cache exhaustion is to preempt
          (pause) requests and swap them to CPU RAM, which causes a sudden
          40 to 100x latency spike for affected requests. The fix is
          aggressive monitoring of KV cache utilization and autoscaling
          before saturation, not after.
        </HighlightBlock>
        <p>
          TTFT latency spikes occur when the scheduler prioritizes filling
          large prefill batches (processing long prompts) over responding
          to new short requests. This is known as <em>prefill starvation</em>
          of the decode phase — the GPU is busy running a massive prefill
          for one request while dozens of short decode requests wait. Modern
          frameworks address this with chunked prefill: large prompts are
          split into chunks of a fixed token budget (e.g., 512 tokens per
          iteration), interleaved with decode steps. This prevents any single
          large prompt from monopolizing the GPU for an entire prefill step,
          smoothing TTFT across all requests. Enable chunked prefill in vLLM
          with <code>--enable-chunked-prefill</code>.
        </p>
        <p>
          Quantization quality regression is a deployment risk that teams
          consistently underestimate. INT4 or AWQ quantization reduces model
          quality metrics by 2 to 5% on average benchmarks, but the
          distribution of quality loss is not uniform. Some tasks (creative
          writing, simple Q&amp;A) show negligible degradation; others
          (multi-step math, code generation with type checking) show 10 to
          20% degradation. The correct approach is to run task-specific
          evaluation — not just perplexity — on the quantized model before
          any production deployment. Cold start latency is a related problem:
          the first request after a new deployment or after a model restart
          pays the full prefill cost with an empty prefix cache. Pre-warming
          the cache by sending synthetic requests matching typical system
          prompts at startup reduces cold start TTFT from 5 to 10 seconds
          to under 1 second for cached prefixes.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: anchor every serving design to concrete numbers —
          model size in parameters, GPU count and type, target concurrency,
          and expected token throughput. Vague answers like &quot;we&apos;d
          use vLLM&quot; without the memory math do not pass staff-level
          interviews.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Serving a 70B model for 1,000 concurrent users requires careful
          memory and throughput planning. A Llama-3 70B in FP16 needs 140 GB
          for weights. With TP=4 on 4xA100 80GB (320 GB total), weights use
          140 GB leaving 180 GB for KV cache. At 4K average context in FP16,
          each concurrent request needs approximately 1.6 GB of KV cache
          (70 layers × 2 heads × 128 dim × 2 (K+V) × 4096 tokens × 2 bytes).
          That allows roughly 100 to 120 concurrent decode requests per
          4xA100 instance. For 1,000 concurrent users, you need approximately
          10 such instances — 40 A100s total. Switching to AWQ INT4 weights
          reduces weight memory to ~35 GB, freeing an additional 105 GB per
          instance for KV cache, doubling the concurrency per instance and
          roughly halving the instance count needed.
        </HighlightBlock>
        <p>
          Multi-model serving on a shared GPU cluster is a common requirement
          for organizations running multiple fine-tuned models (one per use
          case or customer). The challenge is that each model&apos;s weights
          must fit in GPU memory simultaneously if they need to serve requests
          concurrently. Solutions include LoRA multiplexing (serving multiple
          LoRA adapters on top of a shared base model weight, which vLLM
          supports natively), time-sharing (loading and unloading models based
          on demand with aggressive caching of model weights in CPU RAM), and
          model consolidation (combining multiple fine-tuned models into a
          single merged model that serves all use cases). For teams with 10 to
          50 fine-tuned 7B models, LoRA multiplexing is typically the most
          hardware-efficient approach: the base model weights are loaded once,
          and only the 200 to 500 MB LoRA adapter needs to swap between requests.
        </p>
        <p>
          Edge inference with GGUF format and llama.cpp serves deployments
          where cloud latency is unacceptable (real-time robotics, offline
          mobile apps, on-premise healthcare). GGUF is a file format that
          supports mixed-precision quantization: different layers can be
          quantized to different bit widths in the same file. llama.cpp
          implements CPU inference with SIMD optimization and optional GPU
          offloading — it runs a 7B model at 10 to 20 tokens per second on
          a modern laptop CPU, and 30 to 60 TPS on an Apple M2 Max with GPU
          offloading. The serving patterns differ from cloud: there is no
          continuous batching (one user at a time), TTFT is the dominant
          concern, and model selection prioritizes small (3B to 7B) quantized
          models over quality.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: answer with constraints, decisions, trade-offs, and
          how you&apos;d validate or operate the system. Avoid describing
          features without explaining why they matter for the specific problem.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q1: Explain the difference between static batching and continuous
            batching. Why does it matter for LLM serving throughput?
          </h3>
          <HighlightBlock as="p" tier="important">
            Frame your answer around GPU utilization: static batching wastes
            GPU cycles waiting for the slowest request in a batch to finish.
            Continuous batching eliminates that wait.
          </HighlightBlock>
          <p>
            Static batching collects a group of requests, runs them through
            the model together as a batch, and waits until every request in
            the batch completes before scheduling new ones. The GPU idles
            whenever short requests finish while waiting for longer ones —
            if one request generates 10 tokens and another generates 500,
            the GPU runs at effectively 2% utilization for 98% of the
            decode phase for the short request&apos;s slot.
          </p>
          <p>
            Continuous batching (also called iteration-level scheduling or
            in-flight batching) makes a scheduling decision at every single
            decode step. After each token is generated across the current
            batch, the scheduler checks whether any request has finished and
            replaces it immediately with a new request from the queue. The
            batch composition is dynamic — it changes every single forward
            pass. This keeps GPU utilization at 85 to 95% continuously and
            achieves 10 to 30x higher throughput than static batching on the
            same hardware. PagedAttention is the enabling technology: without
            non-contiguous KV cache memory management, it would be impossible
            to slot new requests into freed memory without expensive
            defragmentation.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q2: Design the serving infrastructure for a 70B LLM handling
            1,000 concurrent users with a TTFT SLO of under 1 second and
            TPS SLO of 20 tokens per second.
          </h3>
          <HighlightBlock as="p" tier="important">
            Always start with memory math, then derive GPU count, then
            discuss batching and scheduling configuration to meet the SLOs.
          </HighlightBlock>
          <p>
            Start with weights: Llama-3 70B in AWQ INT4 uses roughly 35 GB.
            A 4xA100 80GB instance has 320 GB total, with 35 GB for weights
            leaving 285 GB for KV cache and overhead. At 4K average context
            with FP16 KV (roughly 1.5 GB per concurrent request at 70B scale),
            one 4xA100 instance can serve approximately 180 concurrent decode
            requests. For 1,000 concurrent users, you need 6 instances (24
            A100s). Add 20% headroom for burst: 8 instances (32 A100s).
          </p>
          <p>
            For the TTFT SLO: enable chunked prefill (512 token chunks) to
            prevent long prompts from blocking short requests. Enable prefix
            caching to reduce prefill cost for system prompt (assuming a
            consistent system prompt across requests). For TPS: 20 tokens per
            second is well within what a 70B model delivers on A100 hardware
            (typically 30 to 50 TPS per request depending on batch size).
            Set up autoscaling based on KV cache utilization: scale out at
            75% utilization, scale in at 30%. Deploy a load balancer that
            routes requests to the instance with the most available KV cache
            capacity, not round-robin.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q3: How does PagedAttention solve the KV cache fragmentation
            problem? What is the mechanism at the memory allocation level?
          </h3>
          <HighlightBlock as="p" tier="important">
            This is a systems question — explain the analogy to OS virtual
            memory, then describe the block table mechanism and why it
            eliminates fragmentation.
          </HighlightBlock>
          <p>
            Without PagedAttention, each request requires a single contiguous
            block of GPU memory for its KV cache, pre-allocated to the maximum
            sequence length. This creates two forms of waste: internal
            fragmentation (space pre-allocated but not yet used as the request
            is mid-generation) and external fragmentation (free memory exists
            but in pieces too small for new requests). Measured waste before
            PagedAttention was 60 to 80% of KV cache memory.
          </p>
          <p>
            PagedAttention divides KV cache into fixed-size physical blocks
            of 16 or 32 tokens. Each block holds the KV tensors for exactly
            that many tokens across all attention heads and all layers. A
            block table (a per-request data structure) maps each request&apos;s
            logical token position ranges to physical block IDs, which need
            not be contiguous in GPU memory. Blocks are allocated one at a
            time as the request generates tokens, and freed atomically when
            the request completes. The physical allocator works like a free-
            list memory allocator: a pool of pre-allocated blocks, issued and
            returned as needed. Memory waste drops to under 4% (worst case:
            last block in a sequence that is partially filled). Shared blocks
            (for prefix caching) use reference counting and copy-on-write
            when a shared block must be modified.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: When should a team self-host an LLM versus using a managed
            API like OpenAI or Anthropic? What are the key decision factors?
          </h3>
          <HighlightBlock as="p" tier="important">
            This is a strategic question. Structure your answer around cost
            crossover point, data privacy requirements, customization needs,
            and operational maturity.
          </HighlightBlock>
          <p>
            The cost crossover point is the most quantifiable factor. Managed
            APIs charge per token: GPT-4o at roughly $5 per million input
            tokens and $15 per million output tokens. At 1 billion tokens per
            month in output, that is $15,000/month for API alone. A 4xA100
            instance costs roughly $10,000 to $14,000 per month on-demand
            (or $4,000 to $6,000 reserved), running a model of comparable
            quality. The break-even point is approximately 500 million to 1
            billion output tokens per month — above this, self-hosting is
            cheaper; below this, API is almost always cheaper when you factor
            in engineering cost of running GPU infrastructure.
          </p>
          <p>
            Beyond cost: data privacy requirements drive self-hosting for
            healthcare, finance, and legal use cases where customer data
            cannot leave the organization. Fine-tuning requirements drive
            self-hosting when you need a model trained on proprietary data
            that cannot be achieved via few-shot prompting alone. Latency
            requirements occasionally drive self-hosting for ultra-low latency
            (&lt;100ms TTFT) use cases where co-locating the model with your
            application removes network round-trip time. Operational maturity
            is the counter-argument: self-hosting requires GPU expertise,
            on-call rotations for GPU OOM incidents, version management, and
            inference optimization work. Most startups should start with managed
            APIs and migrate to self-hosting at the cost crossover point.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q5 (Staff/Principal): Design a multi-tenant GPU cluster serving
            5 different LLMs with SLA isolation — high-priority tenants must
            not be affected by bursty low-priority tenant traffic.
          </h3>
          <HighlightBlock as="p" tier="important">
            This is a systems design problem requiring GPU scheduling,
            multi-model memory management, SLA isolation mechanisms, and
            operational observability. There is no single right answer —
            evaluate trade-offs explicitly.
          </HighlightBlock>
          <p>
            The core problem is that GPU compute and KV cache memory are shared
            resources, and a bursty low-priority tenant can exhaust KV cache
            or saturate the scheduler, causing TTFT spikes for high-priority
            tenants. The solution requires isolation at three levels: routing,
            scheduling, and memory.
          </p>
          <p>
            At the routing level, maintain separate serving instance pools for
            different SLA tiers. High-priority tenants route exclusively to
            dedicated or reserved instances; low-priority tenants route to a
            shared pool. This provides hard isolation but is expensive. An
            alternative is logical isolation within a shared pool with admission
            control: the scheduler enforces per-tenant KV cache quotas (e.g.,
            tenant A gets at most 40% of KV cache) and per-tenant queue depth
            limits. When a low-priority tenant hits its quota, new requests are
            queued or rejected with a 429 rather than competing with high-priority
            tenant KV blocks.
          </p>
          <p>
            For multi-model serving across the same GPUs: if all 5 models use
            the same base architecture (e.g., all are Llama-3 70B fine-tunes),
            LoRA multiplexing is the most efficient approach — load the base
            model once and swap adapters per request. If models differ in size,
            use fractional GPU allocation (smaller models on fewer GPUs) with
            a global memory coordinator tracking total VRAM across the cluster.
            Implement model affinity in the load balancer: route requests for
            the same model to the same instance to avoid eviction and reload.
            Expose per-tenant metrics (TTFT, TPS, preemption rate, queue depth)
            to a central observability platform (Prometheus + Grafana) with
            per-SLA alerting thresholds. The SLA isolation SLO should be
            defined as: high-priority tenant TTFT p99 must not degrade by more
            than 20% when low-priority traffic is at peak.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>
            Kwon et al.{" "}
            <a
              href="https://arxiv.org/abs/2309.06180"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Efficient Memory Management for Large Language Model Serving
              with PagedAttention&quot;
            </a>{" "}
            — SOSP 2023
          </li>
          <li>
            Yu et al.{" "}
            <a
              href="https://arxiv.org/abs/2207.04236"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Orca: A Distributed Serving System for Transformer-Based
              Generative Models&quot;
            </a>{" "}
            — OSDI 2022
          </li>
          <li>
            vLLM Team.{" "}
            <a
              href="https://docs.vllm.ai"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;vLLM Documentation&quot;
            </a>{" "}
            — vllm.ai, 2024
          </li>
          <li>
            Hugging Face.{" "}
            <a
              href="https://huggingface.co/docs/text-generation-inference"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Text Generation Inference Documentation&quot;
            </a>{" "}
            — Hugging Face, 2024
          </li>
          <li>
            Lin et al.{" "}
            <a
              href="https://arxiv.org/abs/2306.00978"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;AWQ: Activation-aware Weight Quantization for LLM
              Compression and Acceleration&quot;
            </a>{" "}
            — MLSys 2024
          </li>
          <li>
            Leviathan et al.{" "}
            <a
              href="https://arxiv.org/abs/2211.17192"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Fast Inference from Transformers via Speculative
              Decoding&quot;
            </a>{" "}
            — ICML 2023
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
