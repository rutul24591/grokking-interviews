"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-ai-model-deployment",
  title: "AI Model Deployment — Serving Patterns and Production Operations",
  description:
    "Comprehensive guide to AI model deployment covering model serving patterns (batch, real-time, edge), model versioning, canary deployments for AI, model rollback, blue-green for models, and production serving infrastructure.",
  category: "other",
  subcategory: "artificial-intelligence",
  slug: "ai-model-deployment",
  wordCount: 5800,
  readingTime: 23,
  lastUpdated: "2026-04-11",
  tags: ["ai", "deployment", "serving", "versioning", "canary", "rollback"],
  relatedTopics: ["ai-testing-evaluation", "ai-application-architecture", "fine-tuning-vs-rag"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>AI model deployment</strong> encompasses the practices,
          infrastructure, and processes for serving AI models in production.
          Unlike deploying traditional software (stateless web servers, batch
          jobs), deploying AI models involves unique challenges: large model
          sizes (gigabytes to terabytes of weights), GPU infrastructure
          requirements, high memory consumption (model weights plus KV cache),
          variable latency (depends on input length and output length), and the
          need for rapid rollback when a new model version produces degraded
          quality.
        </p>
        <p>
          The fundamental deployment decision is <strong>hosted API versus
          self-managed serving</strong>. Hosted APIs (OpenAI, Anthropic)
          eliminate the need for GPU infrastructure and serving expertise — you
          call an HTTP endpoint and the provider manages everything. Self-managed
          serving (vLLM, TGI, Triton) gives full control over model
          configuration, scaling, optimization, and cost, but requires GPU
          infrastructure, serving expertise, and ongoing operational effort.
        </p>
        <p>
          For staff-level engineers, AI model deployment is a critical
          operational concern that affects system reliability, cost, latency,
          and the ability to iterate on model improvements. The deployment
          pipeline must support rapid model updates (new model versions,
          fine-tuned adapters, prompt changes) with zero downtime, automatic
          rollback on quality regression, and comprehensive monitoring of
          serving performance.
        </p>
        <p>
          The evolution of model serving infrastructure reflects the fundamental
          shift from traditional machine learning models to large language models.
          Traditional ML deployment relied on formats like PMML (Predictive
          Model Markup Language) and ONNX (Open Neural Network Exchange), which
          were designed for models with relatively small parameter counts
          (thousands to millions of parameters) and deterministic inference
          patterns. These formats focused on portability across different
          runtimes and frameworks, enabling a model trained in scikit-learn to
          be deployed in a Java production environment, for example. However,
          LLMs with billions of parameters require fundamentally different
          serving infrastructure. The inference pattern changes from a single
          forward pass with fixed input-output shapes to autoregressive token
          generation where the output length is unknown and the KV cache grows
          dynamically with each generated token. This necessitated a new class
          of serving frameworks — vLLM, TGI (Text Generation Inference), and
          TensorRT-LLM — that are purpose-built for the unique memory access
          patterns, GPU utilization requirements, and dynamic batching needs
          of transformer-based language models. These frameworks treat GPU
          memory as a first-class resource to be managed, implement continuous
          batching rather than static batching, and optimize for token-level
          throughput rather than request-level throughput.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          <strong>Model serving patterns</strong> define how models are
          deployed and accessed. <strong>Real-time serving</strong> handles
          individual requests with low latency (sub-second to few seconds),
          suitable for interactive applications. <strong>Batch serving</strong>{" "}
          processes large volumes of requests together, optimizing for
          throughput rather than latency, suitable for offline processing
          (document analysis, data enrichment). <strong>Edge serving</strong>{" "}
          deploys compressed models on edge devices or CDN nodes, reducing
          latency and keeping data on-premise, suitable for privacy-sensitive
          or latency-critical applications.
        </p>
        <p>
          <strong>GPU memory management for model serving</strong> is one of
          the most critical engineering challenges when deploying large models.
          When a model exceeds the memory capacity of a single GPU, it must be
          split across multiple GPUs using one of two parallelism strategies.
          <strong>Tensor parallelism</strong> splits individual weight matrices
          across GPUs — for example, a large linear layer is divided so that
          each GPU holds a fraction of the weight matrix and computes a fraction
          of the output, with all-reduce operations combining the partial
          results at each layer boundary. This approach minimizes communication
          overhead since data is exchanged at every layer but allows the model
          to fit within the memory constraints of smaller GPUs.{" "}
          <strong>Pipeline parallelism</strong> splits the model at the layer
          level, assigning different layer groups to different GPUs. This
          reduces the frequency of inter-GPU communication (data is passed only
          between layer group boundaries rather than at every layer) but
          introduces pipeline bubbles — periods where some GPUs are idle waiting
          for data from the previous stage. In practice, production systems
          often combine both approaches: tensor parallelism within a node
          (GPUs connected via high-bandwidth NVLink) and pipeline parallelism
          across nodes (GPUs connected via PCIe or network), balancing
          communication overhead with memory constraints. The choice of
          parallelism strategy directly impacts serving latency, as inter-GPU
          communication adds overhead to each forward pass, and the optimal
          configuration depends on the model architecture, GPU interconnect
          topology, and the specific memory requirements of the workload.
        </p>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/gpu-memory-allocation.svg"
          alt="GPU Memory Allocation for Model Serving"
          caption="GPU memory breakdown — model weights (35GB INT4 for 70B), KV cache (1-20GB per request), activations (~8GB); concurrent request capacity depends on context length; INT4 quantization doubles throughput vs FP16 with &lt;3% quality loss"
        />

        <p>
          <strong>Model versioning</strong> is essential for tracking which
          model version is serving which traffic. Each model version is
          identified by a unique identifier (model name + version number +
          adapter hash), and the serving infrastructure maintains a mapping of
          traffic routes to model versions. This enables canary deployments
          (routing a small percentage of traffic to a new version), A/B testing
          (comparing two versions side by side), and rapid rollback (switching
          traffic back to the previous version when quality degrades).
        </p>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/model-serving-patterns.svg"
          alt="Model Serving Patterns"
          caption="Serving patterns — real-time (low latency per request), batch (high throughput), and edge (on-device/CDN serving)"
        />

        <p>
          <strong>Continuous batching</strong> is the primary optimization for
          real-time LLM serving. Instead of processing one request at a time
          (inefficient GPU utilization) or waiting for a full batch before
          starting (high latency), continuous batching starts processing a
          request as soon as GPU capacity is available, and adds new requests
          to the batch as previous requests complete their generation. This
          achieves high GPU utilization while maintaining low latency for
          individual requests. vLLM and TGI are the leading frameworks that
          implement continuous batching.
        </p>
        <p>
          A deeper understanding of continuous batching requires examining the
          two distinct phases of LLM inference: <strong>prefill</strong> and{" "}
          <strong>decode</strong>. During the prefill phase, the model processes
          the entire input prompt in parallel — this is a compute-bound operation
          where the GPU can process all input tokens simultaneously, achieving
          high throughput. During the decode phase, the model generates one token
          at a time autoregressively — this is a memory-bound operation where
          each token generation requires reading the entire model weights and KV
          cache from GPU memory, making it significantly slower per token than
          the prefill phase. The key insight behind continuous batching is that
          requests at different stages of their decode phase can be batched
          together efficiently, because the memory-bound nature of decode means
          adding more requests to the batch does not proportionally increase
          compute time. vLLM&apos;s PagedAttention further optimizes this by
          dividing the KV cache into fixed-size blocks (similar to OS memory
          pages) and allocating blocks on demand rather than pre-allocating a
          contiguous block for the maximum possible sequence length. This
          eliminates memory fragmentation — a significant problem in traditional
          KV cache allocation where reserved memory for maximum length goes
          largely unused for shorter sequences — and increases the number of
          concurrent requests a single GPU can handle by 2-4x compared to
          naive KV cache allocation.
        </p>
        <p>
          <strong>Model optimization for serving</strong> involves techniques
          to reduce the memory footprint and improve the throughput of model
          serving. <strong>Quantization</strong> reduces the precision of model
          weights (from FP16 to INT8 or INT4), reducing memory consumption by
          2-4x with minimal quality loss. <strong>Paged attention</strong>{" "}
          (vLLM&apos;s key innovation) manages KV cache memory in non-contiguous
          blocks, reducing memory fragmentation and increasing the number of
          concurrent requests a GPU can handle. <strong>Speculative
          decoding</strong> uses a small draft model to predict multiple tokens
          ahead, which the large model then verifies, effectively speeding up
          generation by 2-3x.
        </p>
        <p>
          <strong>Speculative decoding</strong> deserves deeper examination as
          one of the most promising serving optimizations for production
          deployments. The technique works by deploying a smaller, faster draft
          model (for example, a 1B parameter model) alongside the large target
          model (for example, a 70B parameter model). When processing a request,
          the draft model generates multiple candidate tokens ahead (typically
          4-8 tokens) in an autoregressive manner. Since the draft model is
          much smaller, generating these draft tokens is significantly faster
          than generating them with the large model. The large model then
          receives all draft tokens simultaneously and evaluates the probability
          distribution for each position in a single forward pass. For each
          draft token, the large model checks whether its probability matches
          what the large model would have predicted — if the draft token aligns
          with the large model&apos;s distribution (verified via a rejection
          sampling scheme), the token is accepted and output immediately; if
          not, the large model generates the correct token for that position
          and discards subsequent draft tokens. The acceptance rate of the draft
          model is the critical factor determining speedup — a draft model with
          70-80% acceptance rate can achieve 2-3x speedup because multiple
          tokens are produced per large-model forward pass instead of one. In
          production, speculative decoding is most effective for deterministic
          outputs (code generation, structured data extraction) where the draft
          model&apos;s predictions align more closely with the target model,
          while creative or open-ended generation sees lower acceptance rates
          and correspondingly lower speedup.
        </p>
        <p>
          <strong>Deployment strategies for AI</strong> adapt traditional
          software deployment patterns for the unique characteristics of AI
          models. <strong>Canary deployment for models</strong> routes a small
          percentage of traffic (5-10%) to a new model version, monitors quality
          and performance metrics, and gradually increases traffic if the new
          version performs well. <strong>Blue-green deployment</strong> maintains
          two identical serving environments (blue and green), deploys the new
          model to the idle environment, tests it, and then switches all traffic
          at once. <strong>Shadow deployment</strong> sends a copy of production
          traffic to the new model without returning its responses to users,
          allowing quality evaluation without user impact.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          A production model serving architecture consists of several layers.
          The <strong>gateway layer</strong> handles request routing, load
          balancing, authentication, and rate limiting. The{" "}
          <strong>serving layer</strong> manages model loading, GPU allocation,
          batching, and inference execution. The <strong>optimization layer</strong>{" "}
          implements quantization, paged attention, speculative decoding, and
          other serving optimizations. The <strong>monitoring layer</strong>{" "}
          tracks latency, throughput, GPU utilization, error rates, and quality
          metrics for every served request.
        </p>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/canary-deployment-models.svg"
          alt="Canary Deployment for AI Models"
          caption="Canary deployment — 5% traffic to new model, monitor quality metrics, gradually increase to 100% if quality is maintained"
        />

        <p>
          The <strong>model update pipeline</strong> automates the process of
          deploying a new model version. It starts with model validation
          (checking the model file integrity, compatibility with serving
          infrastructure), followed by shadow deployment (running the new model
          alongside the current model on production traffic without returning
          responses), followed by quality evaluation (comparing shadow model
          outputs against current model outputs using automated evaluation),
          followed by canary deployment (routing a small percentage of traffic
          to the new model), and finally full deployment (switching all traffic
          to the new model).
        </p>
        <p>
          <strong>Rollback procedures</strong> must be automated and immediate.
          When quality monitoring detects a regression (output quality drops
          below threshold, error rate increases, latency exceeds SLO), the
          system must automatically switch traffic back to the previous model
          version. The rollback should be instant (no warm-up time needed, since
          the previous model is still loaded in memory) and should include
          notification to the engineering team with details about what triggered
          the rollback.
        </p>
        <p>
          <strong>Multi-region model serving architecture</strong> is essential
          for globally distributed applications where users expect low-latency
          responses regardless of geographic location. There are two primary
          approaches: <strong>active-active</strong> and{" "}
          <strong>active-passive</strong>. In an active-active architecture,
          model serving instances run in multiple regions simultaneously, and
          a global load balancer routes each request to the nearest region
          based on latency. Both regions handle production traffic, providing
          inherent high availability — if one region fails, traffic is
          automatically rerouted to the remaining regions. However, active-active
          requires significantly more GPU resources (each region must have full
          serving capacity) and introduces complexity in model synchronization
          — all regions must serve the same model version, and model updates
          must be coordinated to avoid serving different versions in different
          regions. In an active-passive architecture, the primary region handles
          all production traffic while a standby region maintains a warm
          replica. The passive region consumes fewer resources (it can run with
          fewer GPUs since it is not serving traffic) but failover is slower
          — the passive region must scale up to full capacity before it can
          absorb production traffic, which can take several minutes for GPU
          clusters. For LLM serving, active-active is typically preferred
          because GPU scaling is slow and latency-sensitive applications
          cannot tolerate the failover delay of active-passive. Data
          synchronization between regions is also a critical consideration —
          model weights are large (gigabytes to terabytes) and should be
          replicated via dedicated artifact storage (object stores with
          cross-region replication) rather than transferred on-demand during
          deployment.
        </p>
        <p>
          The <strong>model registry and artifact management layer</strong>{" "}
          serves as the single source of truth for all model versions deployed
          in production. Similar to how container registries (Docker Hub, ECR)
          manage Docker images, a model registry stores model artifacts with
          versioning, metadata, and access control. The two dominant storage
          formats in modern LLM serving are <strong>GGUF</strong> (GGML
          Universal Format) and <strong>safetensors</strong>. GGUF is a binary
          format designed for efficient loading and memory-mapped access,
          commonly used for quantized models deployed on edge devices or
          CPU-constrained environments. It stores model weights, tokenizer
          configuration, and metadata in a single file, making it portable and
          straightforward to distribute. Safetensors, developed by Hugging Face,
          is a serialization format that stores tensors in a safe, fast format
          without arbitrary code execution risks (unlike Python pickle-based
          formats). It supports lazy loading, where only the tensors needed for
          a specific GPU configuration are loaded into memory, and is the
          preferred format for production GPU serving. The model registry
          tracks each artifact with a unique identifier, the model framework
          version, the quantization level, the adapter configuration, and the
          deployment history. This enables reproducible deployments — any
          model version serving production traffic can be identified,
          retrieved, and redeployed identically across regions or
          environments.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          <strong>Hosted API versus self-managed serving</strong> is the
          fundamental deployment decision. Hosted APIs offer zero operational
          overhead, automatic scaling, and built-in optimizations, but come
          with per-token pricing, rate limits, data privacy concerns, and no
          control over serving optimization. Self-managed serving offers full
          control, predictable costs (infrastructure amortization), data
          privacy, and custom optimization, but requires GPU infrastructure,
          serving expertise, and ongoing operational effort.
        </p>
        <p>
          <strong>GPU versus CPU serving</strong> involves a cost-versus-latency
          trade-off. GPU serving provides the lowest latency and highest
          throughput but requires expensive GPU hardware. CPU serving is
          significantly cheaper but 10-50x slower, making it suitable only for
          small models (under 7B parameters) with relaxed latency requirements.
          For most production LLM serving, GPU is essential.
        </p>
        <p>
          <strong>Cold start versus warm pool serving</strong> represents a
          fundamental trade-off between cost efficiency and latency performance.
          In a cold start approach, GPU instances are provisioned on-demand
          when traffic arrives and terminated when idle, minimizing infrastructure
          costs during low-traffic periods. However, loading a large model onto
          a GPU can take several minutes — the model weights must be read from
          disk, transferred to GPU memory, and the model must be compiled for
          the specific GPU architecture. This makes cold start serving
          unacceptable for latency-sensitive interactive applications where
          users expect responses within seconds. In a warm pool approach, a
          baseline number of GPU instances are kept running with models pre-loaded
          at all times, ensuring sub-second response times for incoming requests.
          The trade-off is cost — GPUs are expensive to run continuously, and
          during low-traffic periods, warm pool instances sit idle consuming
          resources. A hybrid approach is common in production: maintain a warm
          pool sized for baseline traffic (the 10th-25th percentile of demand)
          to guarantee low latency for normal operations, and supplement with
          cold-start instances during traffic spikes. The cold-start instances
          can pre-load the most commonly served models during their boot
          sequence to reduce warm-up time, though they will still lag behind
          warm pool instances by several minutes. For applications with
          predictable traffic patterns (business hours peaks, known batch
          processing windows), the warm pool can be dynamically resized on a
          schedule, scaling down during off-hours and scaling up before
          anticipated traffic.
        </p>
        <p>
          <strong>Edge versus cloud inference</strong> presents another set of
          trade-offs that depend on the specific application requirements.
          Edge inference — running models on user devices (smartphones, laptops,
          IoT devices) or at CDN edge nodes — offers the lowest possible latency
          because there is no network round-trip time, keeps data on the user&apos;s
          device for maximum privacy, and eliminates per-token serving costs
          after the initial model download. However, edge devices have severely
          constrained compute and memory compared to cloud GPUs. A model that
          runs at 50 tokens per second on a cloud A100 may run at 5-10 tokens
          per second on a high-end smartphone NPU, requiring aggressive
          quantization (4-bit or lower) and architectural optimizations to
          achieve acceptable performance. Cloud inference, by contrast, offers
          access to the most capable models (unconstrained by device memory),
          centralized updates (the model is updated once on the server rather
          than requiring each user device to download a new version), and the
          ability to scale compute resources independently of user demand. The
          decision typically hinges on three factors: privacy requirements
          (healthcare, financial, or personal data may mandate on-device
          processing), latency sensitivity (real-time applications like voice
          assistants benefit from edge processing to avoid network latency),
          and model capability requirements (complex reasoning tasks that
          require large models with 70B+ parameters cannot run on edge devices
          and must use cloud inference). Many production systems adopt a
          tiered approach: small, fast models run on the edge for simple tasks
          (classification, short-form generation, intent detection), and
          requests that exceed the edge model&apos;s capabilities are escalated
          to the cloud for processing by a larger, more capable model.
        </p>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/model-versioning-strategy.svg"
          alt="Model Versioning Strategy"
          caption="Model versioning — each version tracked by model ID + adapter hash + prompt version, with traffic routing and rollback capability"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          <strong>Implement automated quality gates before deployment</strong>{" "}
          — every new model version must pass the golden dataset evaluation
          before it is deployed. If the new model&apos;s quality score is below
          the current model&apos;s score, block the deployment and alert the
          team. This prevents quality regressions from reaching production.
        </p>
        <p>
          <strong>Use canary deployment for all model changes</strong> — never
          switch 100% of traffic to a new model version without first testing
          it on a small percentage of traffic. Start with 5%, monitor quality
          and performance metrics for at least one hour (longer for low-traffic
          applications), and gradually increase traffic if metrics are stable.
          This catches quality issues that were not detected by offline
          evaluation.
        </p>
        <p>
          <strong>Keep the previous model loaded for instant rollback</strong>{" "}
          — when deploying a new model version, do not unload the previous
          version until the new version has been running successfully for a
          sufficient period (typically 24-48 hours). This enables instant
          rollback if the new version produces quality regressions, without
          the latency of reloading the previous model from disk.
        </p>
        <p>
          <strong>Monitor serving performance continuously</strong> — track
          latency (TTFT, total response time, p95, p99), throughput (requests
          per second, tokens per second), GPU utilization (memory, compute),
          error rates (timeouts, OOM, API errors), and cost per request. Set
          up alerts for anomalies in any of these metrics.
        </p>
        <p>
          <strong>Implement health checks and readiness probes</strong> for
          every model serving endpoint. A health check confirms that the serving
          process is running and the GPU is accessible, while a readiness probe
          verifies that the model is fully loaded, warmed up, and capable of
          processing requests. The distinction matters because a serving process
          may be running (passing the health check) but still loading the model
          into GPU memory (failing the readiness probe). During deployment, the
          readiness probe should block traffic from reaching the new model
          instance until the model is fully loaded and any compilation or
          optimization steps (such as CUDA graph capture for optimized GPU
          kernels) are complete. Health checks should run at a higher frequency
          (every 5-10 seconds) to detect GPU driver crashes or CUDA context
          failures quickly, while readiness probes can run less frequently
          (every 30 seconds) since model loading is a slower operation. The
          health check endpoint should also report GPU memory usage, current
          batch size, and the number of active requests, providing operational
          visibility without requiring access to the serving infrastructure&apos;s
          internal metrics dashboard.
        </p>
        <p>
          <strong>Establish a rigorous capacity planning methodology</strong>{" "}
          before deploying models to production. Capacity planning for GPU-based
          model serving requires a systematic approach: start by measuring the
          model&apos;s memory footprint (weights plus the expected KV cache at
          target context length), then determine the maximum concurrent requests
          per GPU based on available memory after model loading. For example,
          a 70B model in FP16 requires 140GB for weights alone, which exceeds
          a single A100&apos;s 80GB — requiring tensor parallelism across at
          least two GPUs. After accounting for model weights, calculate the
          per-request KV cache size (typically 0.5-2MB per token of context
          length depending on model architecture), and divide remaining GPU
          memory by this value to determine maximum concurrent requests. Then
          factor in peak traffic patterns — the GPU cluster must handle the
          maximum expected concurrent requests, not the average. Implement
          request queuing for overflow traffic, and configure horizontal scaling
          to add GPU instances when the queue depth consistently exceeds a
          threshold over a sustained period (typically 5-10 minutes to avoid
          reactive scaling during brief traffic spikes). It is also important
          to plan for model growth — newer model versions tend to have more
          parameters, so capacity planning should account for a 2-4x increase
          in model size over the next 12-18 months based on industry trends.
        </p>
        <p>
          <strong>Apply model compression techniques strategically</strong>{" "}
          based on the serving requirements and quality constraints.{" "}
          <strong>Quantization</strong> is the most widely used compression
          technique, reducing weight precision from FP16 to INT8 (2x reduction)
          or INT4 (4x reduction). Post-training quantization (PTQ) applies
          quantization after training without retraining, and is suitable when
          the model is robust to reduced precision — most large models (70B+)
          tolerate INT8 quantization with negligible quality loss. For INT4
          quantization, quality degradation becomes noticeable, and techniques
          like GGUF&apos;s k-quant mix (quantizing some layers at higher
          precision than others) can mitigate this. <strong>Pruning</strong>{" "}
          removes individual weights or attention heads that contribute least
          to the model&apos;s output, reducing model size without changing the
          inference path. Structured pruning (removing entire attention heads
          or layers) is preferred for serving because it directly reduces
          compute requirements, whereas unstructured pruning (removing
          individual weights) produces sparse matrices that require specialized
          hardware support to accelerate. <strong>Knowledge distillation</strong>{" "}
          trains a smaller student model to replicate the behavior of a larger
          teacher model, producing a compact model that can serve with lower
          latency. Distillation is the most aggressive compression technique — a
          1B distilled model can replace a 70B model for specific tasks — but
          requires task-specific training data and compute, making it suitable
          only for high-volume, well-defined workloads where the serving cost
          savings justify the distillation investment.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is <strong>deploying without quality
          evaluation</strong> — deploying a new model version based solely on
          the provider&apos;s claims without testing it against your specific
          workload. Different models excel at different tasks, and a model that
          scores higher on general benchmarks may perform worse on your specific
          use case. Always evaluate the new model against your golden dataset
          before deployment.
        </p>
        <p>
          <strong>Not accounting for KV cache memory</strong> — when planning
          GPU capacity, many teams account only for model weights but forget
          the KV cache, which can consume as much or more memory than the model
          weights themselves for long-context serving. A 70B model (140GB in
          FP16) with 128K context serving may need 30-50GB additional memory
          for the KV cache per concurrent request. This hidden memory consumer
          is the primary cause of out-of-memory (OOM) errors under production
          load. The KV cache grows dynamically with each request&apos;s context
          length, meaning that a serving instance configured for an average
          context length of 4K tokens can handle many concurrent requests, but
          when users submit prompts approaching the maximum context length
          (32K, 64K, or 128K tokens), the KV cache consumption spikes
          dramatically and GPU memory is exhausted. The mitigation is to
          configure explicit memory budgets: reserve a fixed portion of GPU
          memory exclusively for the KV cache (for example, 40% of total GPU
          memory), and reject or queue requests that would exceed this budget.
          Paged attention helps by eliminating fragmentation, but it does not
          reduce the total memory needed — it only ensures that available
          memory is used efficiently.
        </p>
        <p>
          <strong>Slow rollback procedures</strong> — if rolling back to the
          previous model requires unloading the new model and loading the
          previous model from disk (which can take minutes for large models),
          the system experiences an extended outage during rollback. Keep the
          previous model loaded in memory for instant rollback, or use a
          blue-green deployment where the previous model is always available on
          a separate serving environment.
        </p>
        <p>
          <strong>Ignoring model warm-up time</strong> — when a model is first
          loaded, the serving infrastructure may need to compile the model for
          the specific GPU architecture, which can take several minutes. During
          this warm-up period, latency is significantly higher. The warm-up
          process involves multiple steps: loading model weights from disk into
          host memory, transferring weights to GPU memory via PCIe, initializing
          the CUDA context, and for frameworks that support it, capturing CUDA
          graphs for optimized kernel execution. CUDA graph capture is
          particularly time-consuming because it requires running the model
          through representative input shapes to record the execution graph,
          and this recording step can take 5-15 minutes for large models.
          Production systems should pre-warm model instances before routing
          any traffic to them — the readiness probe should not pass until the
          model has completed its full warm-up sequence, including CUDA graph
          capture if applicable. Sending traffic to a model during warm-up
          results in elevated p99 latencies that can violate SLAs and degrade
          user experience, even though the model is technically &quot;running.&quot;
          Additionally, teams should measure and document the warm-up time for
          each model configuration as part of the deployment runbook, so that
          capacity planning accounts for the time needed to scale up new
          instances during traffic spikes.
        </p>
        <p>
          <strong>Underestimating the operational complexity of multi-model
          serving</strong> — many teams assume that hosting multiple model
          versions on the same GPU cluster is straightforward, but in practice
          it introduces significant operational complexity. Each model version
          competes for the same GPU memory, and without careful resource
          allocation, one model can starve others of memory and compute. The
          serving infrastructure must implement fair scheduling (ensuring each
          model gets its allocated share of GPU resources), priority queues
          (allowing critical models to preempt lower-priority ones during
          resource contention), and memory isolation (preventing one model&apos;s
          KV cache from consuming memory allocated to another model). Frameworks
          like vLLM support multi-model serving through model parallel instances,
          but configuring the right memory split between models requires
          empirical measurement of each model&apos;s memory profile under
          production workload. Without this discipline, teams end up with
          unpredictable latency where one model&apos;s performance degrades
          whenever another model experiences a traffic spike.
        </p>
        <p>
          <strong>Failing to implement request-level timeout and cancellation
          handling</strong> — LLM serving has variable response times that
          depend on input length, output length, and current GPU load. When a
          client disconnects (user closes the browser, mobile app goes to
          background, API caller times out), the serving instance may continue
          generating tokens for that request, consuming GPU compute and KV cache
          memory for a response that will never be delivered. Without proper
          cancellation handling, these orphaned requests accumulate over time,
          gradually consuming GPU memory and reducing the number of concurrent
          requests the instance can handle. The serving infrastructure must
          listen for client disconnection signals (HTTP/2 stream reset,
          WebSocket close, SSE connection termination) and immediately free
          the KV cache slots and GPU compute allocated to that request.
          Additionally, server-side timeouts should be configured to abort
          requests that exceed a maximum processing time, preventing a single
          long-running request from blocking GPU resources indefinitely.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>Continuous model improvement pipeline</strong> — an AI
          platform that automatically evaluates new model versions against the
          golden dataset, deploys passing models as canaries, monitors quality
          in production, and promotes successful models to full deployment.
          This pipeline enables the team to deploy model improvements weekly
          rather than monthly, with confidence that each deployment maintains
          or improves quality.
        </p>
        <p>
          <strong>Multi-model serving platform</strong> — a shared serving
          infrastructure that hosts multiple model versions simultaneously,
          routing traffic based on feature flags, user segments, or quality
          scores. This enables A/B testing different models, serving different
          models to different customers based on their SLA tier, and rapid
          failover between models when one experiences issues.
        </p>
        <p>
          <strong>Global conversational AI serving at scale</strong> — a
          customer service platform deploying a 70B parameter LLM across four
          regions (US-East, US-West, EU-Central, APAC-Southeast) using an
          active-active architecture with vLLM serving on A100 GPU clusters.
          Each region runs 16 A100 GPUs (80GB) with tensor parallelism of 2
          (two GPUs per model instance), supporting 8 model instances per
          region. The platform processes 50,000 concurrent conversations with
          an average context length of 8K tokens, achieving a p95 latency of
          1.2 seconds for time-to-first-token and 25 tokens per second for
          generation throughput. By implementing continuous batching with
          PagedAttention, the platform increased concurrent request capacity
          per GPU from 8 to 28, reducing the total GPU requirement from 64 to
          18 GPUs — a 72% cost savings. The multi-region setup provides
          automatic failover: when US-East experienced a 45-minute outage
          during a cloud provider incident, the global load balancer
          redistributed traffic to the remaining three regions within 30
          seconds, with no customer-visible downtime. Cross-region model
          synchronization is handled via a model registry backed by S3 with
          cross-region replication, ensuring all regions serve identical model
          versions within 15 minutes of a deployment.
        </p>
        <p>
          <strong>Real-time document analysis with speculative decoding</strong>{" "}
          — a legal technology company deployed a document analysis pipeline
          that processes contracts, briefs, and legal opinions in real-time
          as attorneys review them. The system uses a 13B parameter model
          with speculative decoding, where a 1B parameter draft model predicts
          6 tokens ahead and the 13B model verifies them. Because legal
          documents follow highly structured language patterns, the draft
          model achieves an 82% acceptance rate, producing an effective 2.4x
          speedup in generation throughput. The serving infrastructure runs
          on 4 A100 GPUs (40GB) with INT8 quantization, handling 200
          concurrent document analysis sessions. Before speculative decoding,
          the system required 10 A100 GPUs to handle the same traffic, and
          the p95 latency for a 5,000-word document analysis was 45 seconds.
          With speculative decoding, the p95 latency dropped to 18 seconds,
          enabling attorneys to receive analysis results within their natural
          reading rhythm. The system processes 15,000 documents per day,
          with each document averaging 12K tokens of input context and 3K
          tokens of generated analysis, totaling 225 million tokens of daily
          throughput on a fraction of the original GPU infrastructure cost.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q1: How do you deploy a new model version with zero downtime?
          </h3>
          <p>
            Zero-downtime model deployment uses canary deployment or blue-green
            deployment. With canary deployment, the new model is deployed
            alongside the current model, and a small percentage of traffic
            (5-10%) is routed to the new model. Quality and performance metrics
            are monitored, and if they are stable, traffic is gradually
            increased (5% → 25% → 50% → 100%). The current model remains
            loaded throughout the process, enabling instant rollback by
            switching traffic back.
          </p>
          <p>
            With blue-green deployment, two identical serving environments are
            maintained. The new model is deployed to the idle environment,
            tested, and then all traffic is switched at once. This is faster
            than canary but riskier — if the new model has issues, all users
            are affected simultaneously.
          </p>
          <p>
            Key requirements for zero-downtime deployment: the serving
            infrastructure must support loading multiple models simultaneously,
            the load balancer must support dynamic traffic routing, and quality
            monitoring must be real-time to detect issues immediately.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q2: What is continuous batching and why is it important for LLM
            serving?
          </h3>
          <p>
            Continuous batching is a serving optimization that maximizes GPU
            utilization by dynamically adding new requests to the processing
            batch as previous requests complete their generation. Traditional
            static batching waits for a full batch before starting processing
            (high latency for early requests) or processes one request at a
            time (low GPU utilization). Continuous batching starts processing
            as soon as the first request arrives, and whenever a request
            finishes generating its output, its GPU slot is freed and a new
            request is added to the batch.
          </p>
          <p>
            This achieves both low latency (requests start processing
            immediately rather than waiting for a full batch) and high
            throughput (GPU is kept busy at all times). For LLM serving, where
            requests have variable output lengths, continuous batching is
            essential for efficient GPU utilization — some requests may generate
            50 tokens while others generate 500, and continuous batching ensures
            that GPU capacity freed by short requests is immediately used for
            new requests.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q3: How do you handle model rollback when quality degrades?
          </h3>
          <p>
            Model rollback must be automated and immediate. The serving
            infrastructure monitors quality metrics in real-time (output quality
            scores, error rates, user satisfaction), and when any metric drops
            below a defined threshold, the system automatically switches traffic
            back to the previous model version. The previous model should remain
            loaded in memory for instant rollback — switching the traffic route
            takes milliseconds, while loading a model from disk can take minutes.
          </p>
          <p>
            The rollback process should include: immediate traffic switch (all
            traffic routed to previous model), notification to the engineering
            team (with details about what triggered the rollback and which
            metrics degraded), logging of the rollback event (for post-mortem
            analysis), and optional automatic filing of an incident ticket.
            After rollback, the team investigates the root cause, fixes the
            issue, and re-deploys the new model version through the standard
            canary deployment process.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: What are the key considerations for GPU capacity planning in
            model serving?
          </h3>
          <p>
            GPU capacity planning for model serving requires accounting for
            three memory consumers: model weights (the model parameters loaded
            into GPU memory), KV cache (the key and value vectors stored for
            each active request, growing linearly with context length), and
            activation memory (intermediate computation buffers, typically small
            relative to weights and cache). For a 70B model in FP16, the weights
            consume 140GB, and the KV cache can consume 2-4GB per concurrent
            request at 128K context.
          </p>
          <p>
            The key capacity question is: how many concurrent requests can a
            GPU handle? This depends on the available memory after loading the
            model weights, divided by the per-request KV cache size. For a
            single A100 (80GB) serving a 70B model, there is no room for the
            KV cache after loading the weights — multi-GPU serving is required.
            For a 7B model (14GB weights), an A100 can handle 15-20 concurrent
            requests at 8K context, depending on the serving optimization
            (paged attention significantly increases this number).
          </p>
          <p>
            Additionally, plan for peak traffic (not average traffic) — the
            GPU capacity must handle the maximum expected concurrent requests
            without queuing. Implement request queuing for traffic that exceeds
            GPU capacity, and scale the number of GPUs horizontally when the
            queue depth consistently exceeds a threshold.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q5: How do you design a serving infrastructure that can handle
            both latency-sensitive interactive requests and throughput-sensitive
            batch requests on the same GPU cluster?
          </h3>
          <p>
            This is a classic resource isolation and scheduling problem. The
            core challenge is that interactive requests (chat, real-time
            assistance) require low time-to-first-token (under 1 second) and
            consistent per-token latency, while batch requests (document
            analysis, data enrichment) prioritize total throughput over
            individual request latency. Running both workloads on the same
            GPUs without isolation means batch requests can monopolize GPU
            compute and KV cache memory, causing interactive request latency
            to spike unpredictably.
          </p>
          <p>
            The solution involves three layers of isolation. First,{" "}
            <strong>GPU partitioning</strong> — allocate a dedicated subset
            of GPUs for interactive workloads and a separate subset for batch
            workloads. For example, in a cluster of 20 A100 GPUs, dedicate
            12 GPUs to interactive serving (guaranteeing low latency for
            user-facing requests) and 8 GPUs to batch serving (maximizing
            throughput for offline processing). The split ratio should be
            determined by traffic patterns and adjusted dynamically based on
            time of day — more GPUs for interactive serving during business
            hours, more for batch serving during off-hours. Second,{" "}
            <strong>request priority scheduling</strong> — within each GPU
            partition, the serving framework should implement priority-based
            scheduling where interactive requests are assigned higher priority
            and are scheduled into the continuous batch ahead of batch requests.
            vLLM supports priority scheduling through its scheduler
            configuration, allowing interactive requests to preempt batch
            requests when GPU memory is constrained. Third,{" "}
            <strong>separate KV cache budgets</strong> — configure explicit
            KV cache memory limits for each workload type. Interactive
            requests typically have shorter context lengths (4K-16K tokens),
            while batch requests may use the full context window (32K-128K
            tokens). By capping the KV cache allocation for batch workloads
            (for example, 60% of total available KV cache memory), you prevent
            a few large batch requests from starving interactive requests of
            cache memory. For organizations with strict SLA requirements, the
            most robust approach is to run interactive and batch serving on
            entirely separate GPU clusters with independent scaling policies,
            accepting the higher infrastructure cost in exchange for guaranteed
            latency isolation.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>
            Kwon, W. et al. (2023).{" "}
            <a
              href="https://arxiv.org/abs/2309.06180"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;vLLM: Easy, Fast, and Cheap LLM Serving with PagedAttention&quot;
            </a>{" "}
            — arXiv:2309.06180
          </li>
          <li>
            Hugging Face.{" "}
            <a
              href="https://huggingface.co/docs/text-generation-inference/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Text Generation Inference (TGI) Documentation
            </a>
          </li>
          <li>
            NVIDIA.{" "}
            <a
              href="https://developer.nvidia.com/triton-inference-server"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Triton Inference Server
            </a>
          </li>
          <li>
            Google.{" "}
            <a
              href="https://cloud.google.com/kubernetes-engine/docs/concepts/blue-green-deployments"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blue-Green Deployments — Google Cloud
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
