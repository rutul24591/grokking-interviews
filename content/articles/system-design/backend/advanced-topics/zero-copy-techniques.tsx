"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-advanced-topics-zero-copy-techniques",
  title: "Zero-Copy Techniques",
  description:
    "Staff-level deep dive into zero-copy I/O: sendfile, mmap, splice, DMA, kernel bypass, and production-scale patterns for high-throughput data transfer in web servers, databases, and message brokers.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "zero-copy-techniques",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-08",
  tags: ["backend", "zero-copy", "sendfile", "mmap", "splice", "dma", "io-uring"],
  relatedTopics: ["tail-latency", "network-communication", "time-series-optimization", "database-indexes"],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/advanced-topics";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Zero-copy techniques</strong> are I/O optimization strategies that eliminate
          unnecessary data copies between the kernel and user space during data transfer
          operations. In traditional I/O, reading a file from disk and sending it over a
          network involves four data copies: (1) DMA copy from disk to kernel buffer, (2)
          CPU copy from kernel buffer to user buffer, (3) CPU copy from user buffer to kernel
          socket buffer, and (4) DMA copy from kernel socket buffer to the network interface.
          Each copy consumes CPU cycles and memory bandwidth, limiting the throughput of
          data-intensive applications.
        </p>
        <p>
          Zero-copy techniques eliminate the intermediate copies by transferring data directly
          from the kernel file buffer to the kernel socket buffer (using sendfile) or by
          mapping the file into the process&apos;s address space (using mmap) and letting
          the kernel transfer data directly from the mapped memory to the socket. This reduces
          the number of copies from four to two (both DMA copies, which do not consume CPU
          cycles), improving throughput by 2-4x and reducing CPU usage by 50-75%.
        </p>
        <p>
          For staff/principal engineers, zero-copy techniques require understanding the
          trade-offs between different zero-copy approaches (sendfile, mmap, splice, io_uring),
          the kernel data flow and CPU usage for each technique, and the application of
          zero-copy in production systems (nginx, Kafka, databases, network proxies).
        </p>
        <p>
          The business impact of zero-copy decisions is significant. Zero-copy enables
          high-throughput data transfer with minimal CPU usage, which is critical for
          web servers serving large static files, message brokers streaming large messages,
          and databases replicating large WAL files. Without zero-copy, these systems
          would be CPU-bound (limited by CPU cycles spent on data copies) rather than
          I/O-bound (limited by disk or network bandwidth).
        </p>
        <p>
          In system design interviews, zero-copy techniques demonstrate understanding of
          OS I/O architecture, DMA, kernel-user space boundaries, system call overhead,
          and the application of zero-copy in production-scale data transfer systems.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src={`${BASE_PATH}/zero-copy-traditional-vs-zero-copy.svg`}
          alt="Traditional I/O (4 copies: disk → kernel buffer → user buffer → kernel socket buffer → NIC) vs zero-copy sendfile (2 DMA copies: disk → kernel buffer → NIC)"
          caption="Traditional I/O requires 4 data copies (2 DMA, 2 CPU) and 4 context switches; zero-copy sendfile reduces this to 2 DMA copies and 2 context switches, eliminating CPU copies and reducing CPU usage by 50-75%"
        />

        <h3>Traditional I/O Data Path</h3>
        <p>
          Traditional I/O involves four data copies and four context switches. When a
          application reads a file and sends it over the network: (1) The read() system
          call triggers a DMA copy from disk to the kernel buffer (copy 1). (2) The kernel
          copies the data from the kernel buffer to the user buffer (copy 2, CPU copy).
          (3) The send() system call triggers a CPU copy from the user buffer to the kernel
          socket buffer (copy 3, CPU copy). (4) The kernel initiates a DMA copy from the
          kernel socket buffer to the network interface card (copy 4, DMA copy).
        </p>
        <p>
          The CPU copies (copies 2 and 3) consume CPU cycles and memory bandwidth, limiting
          the throughput of data-intensive applications. For a 1 GB file transfer, the CPU
          performs 2 GB of copies (read + write), consuming approximately 200ms of CPU time
          on a typical server (10 GB/s memory bandwidth). This is 200ms of CPU time that
          could be spent on application logic.
        </p>

        <h3>sendfile() Zero-Copy</h3>
        <p>
          The sendfile() system call transfers data directly from a file descriptor to a
          socket descriptor within the kernel, eliminating the user buffer copies. The
          data path is: (1) DMA copy from disk to kernel buffer (copy 1, DMA). (2) DMA
          copy from kernel buffer to network interface (copy 2, DMA). The CPU is not
          involved in copying data; it only initiates the DMA transfers. This reduces
          CPU usage by 50-75% and improves throughput by 2-4x compared to traditional
          I/O.
        </p>
        <p>
          sendfile() is used by nginx to serve static files, by Kafka to transfer message
          segments to consumers, and by many web servers to serve large files efficiently.
          The limitation of sendfile() is that it only works for file-to-socket transfers;
          it cannot be used for arbitrary file descriptors (e.g., socket-to-socket transfers).
        </p>

        <h3>mmap() and splice()</h3>
        <p>
          mmap() maps a file into the process&apos;s address space, allowing the process to
          access the file&apos;s contents as if they were in memory. The kernel handles
          page faults to load file data into memory on demand. When the process sends the
          mapped data over a socket, the kernel copies the data from the mapped memory to
          the kernel socket buffer. This eliminates the user buffer copy (copy 2 in
          traditional I/O) but still requires the CPU copy from the mapped memory to the
          kernel socket buffer (copy 3).
        </p>
        <p>
          splice() is a Linux-specific system call that transfers data between two file
          descriptors without copying data into user space. It uses a pipe buffer as an
          intermediary, but the data never enters user space. splice() is more flexible
          than sendfile() because it works for arbitrary file descriptor pairs (e.g.,
          socket-to-socket, file-to-file), not just file-to-socket. splice() is used by
          network proxies (HAProxy, Envoy) to forward data between sockets without
          copying data into user space.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/zero-copy-sendfile-mmap.svg`}
          alt="Three zero-copy techniques compared: sendfile() (2 DMA copies, lowest CPU), mmap() (1 CPU copy, allows in-place processing), splice() (2 DMA copies via pipe, most flexible for any FD pair)"
          caption="Three zero-copy techniques — sendfile() provides lowest CPU usage (2 DMA copies only), mmap() allows in-place data processing (1 CPU copy), splice() provides maximum flexibility for any file descriptor pair (2 DMA copies via pipe buffer)"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Zero-Copy in Web Servers</h3>
        <p>
          nginx uses sendfile() to serve static files with zero-copy. When a client requests
          a static file, nginx opens the file and calls sendfile() to transfer the file
          directly to the client&apos;s socket. The data flows from disk to the kernel buffer
          (DMA) and from the kernel buffer to the network interface (DMA), without entering
          user space. This enables nginx to serve large files at near-disk-bandwidth speeds
          with minimal CPU usage.
        </p>
        <p>
          For dynamic content (generated by the application), nginx uses mmap() to map the
          response body into memory and then sends it over the socket. This eliminates the
          user buffer copy for the response body, reducing CPU usage for dynamic content
          serving as well.
        </p>

        <h3>Zero-Copy in Message Brokers</h3>
        <p>
          Kafka uses zero-copy (transferTo(), which is the Java equivalent of sendfile())
          to transfer message segments from the page cache to the network socket. When a
          consumer requests messages, Kafka reads the messages from the page cache (which
          are already cached by the OS from the producer&apos;s write) and uses transferTo()
          to transfer them directly to the consumer&apos;s socket. This eliminates the CPU
          copies that would be required to copy messages from the page cache to the
          application buffer and from the application buffer to the socket buffer.
        </p>
        <p>
          Kafka&apos;s zero-copy design enables it to achieve throughput of millions of
          messages per second per broker with minimal CPU usage. Without zero-copy, Kafka
          would be CPU-bound (limited by CPU cycles spent on data copies) rather than
          I/O-bound (limited by disk or network bandwidth).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/zero-copy-use-cases.svg`}
          alt="Zero-copy use cases: nginx serving static files with sendfile, database replication streaming WAL with splice, Kafka broker zero-copy message delivery to consumers"
          caption="Production zero-copy use cases — nginx uses sendfile() for static file serving (2 DMA copies), databases use splice() for WAL streaming replication (socket-to-socket transfer), Kafka uses transferTo() for zero-copy message delivery to consumers"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Zero-copy techniques involve trade-offs between CPU usage, flexibility, and
          applicability. sendfile() provides the lowest CPU usage (2 DMA copies only) but
          only works for file-to-socket transfers. mmap() allows in-place data processing
          (the application can modify the mapped data before sending) but requires 1 CPU
          copy (from mapped memory to kernel socket buffer). splice() provides maximum
          flexibility (any file descriptor pair) but requires a pipe buffer intermediary,
          which adds complexity.
        </p>
        <p>
          The choice of zero-copy technique depends on the use case. For serving static
          files (web servers, CDN), sendfile() is the best choice (lowest CPU usage,
          simplest implementation). For streaming data between sockets (network proxies,
          database replication), splice() is the best choice (works for socket-to-socket).
          For applications that need to process data before sending (compression, encryption),
          mmap() is the best choice (allows in-place processing).
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use sendfile() for file-to-socket transfers (static file serving, message broker
          delivery). sendfile() provides the lowest CPU usage (2 DMA copies only) and the
          simplest implementation (one system call). Enable sendfile() in your web server
          (nginx: sendfile on; Apache: EnableSendfile On) and message broker (Kafka:
          zero-copy enabled by default).
        </p>
        <p>
          Use splice() for socket-to-socket transfers (network proxies, database replication).
          splice() works for any file descriptor pair, making it suitable for forwarding
          data between sockets without copying data into user space. Implement splice()
          with a pipe buffer as the intermediary, and ensure that the pipe buffer is sized
          appropriately for the data transfer size (typically 64 KB-1 MB).
        </p>
        <p>
          Use mmap() for applications that need to process data before sending (compression,
          encryption, transformation). mmap() maps the file into the process&apos;s address
          space, allowing the application to access the file&apos;s contents directly and
          modify them before sending. This eliminates the user buffer copy for reading the
          file, while still allowing the application to process the data.
        </p>
        <p>
          Monitor CPU usage and throughput before and after enabling zero-copy to measure
          the improvement. Zero-copy typically reduces CPU usage by 50-75% and improves
          throughput by 2-4x for large file transfers. If the improvement is less than
          expected, check that the file system supports sendfile() (some network file
          systems do not) and that the kernel version supports splice() (Linux 2.6.17+).
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is using sendfile() for small files. For small files
          (less than 4 KB), the overhead of the sendfile() system call (context switch,
          kernel processing) exceeds the savings from eliminating the CPU copies. For
          small files, traditional I/O (read + write) is faster because the data fits
          in the CPU cache and the copies are fast. The fix is to use sendfile() only
          for files larger than a threshold (typically 4 KB-16 KB) and traditional I/O
          for smaller files.
        </p>
        <p>
          Not handling partial transfers is a common pitfall with sendfile() and splice().
          These system calls may transfer less data than requested (e.g., if the socket
          buffer is full or the file is truncated during the transfer). The fix is to
          check the return value of sendfile() and splice() and retry if the transfer
          was partial, continuing until all data is transferred.
        </p>
        <p>
          Assuming zero-copy eliminates all CPU overhead is a misunderstanding. Zero-copy
          eliminates CPU copies, but the CPU is still involved in initiating DMA transfers,
          handling interrupts, and managing the kernel data structures. For very large
          transfers, the CPU overhead of DMA management is negligible, but for small
          transfers, it can be significant. The fix is to batch small transfers into
          larger transfers (e.g., combine multiple small files into a single sendfile()
          call) to amortize the CPU overhead.
        </p>
        <p>
          Using zero-copy on file systems that do not support it causes fallback to
          traditional I/O silently. Some network file systems (NFS, CIFS) do not support
          sendfile() or splice(), and the kernel falls back to traditional I/O without
          notifying the application. The fix is to check the file system type before
          using zero-copy and fall back to traditional I/O explicitly if the file system
          does not support zero-copy.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>nginx: Static File Serving</h3>
        <p>
          nginx uses sendfile() to serve static files with zero-copy. When a client requests
          a static file, nginx opens the file and calls sendfile() to transfer the file
          directly to the client&apos;s socket. This enables nginx to serve large files at
          near-disk-bandwidth speeds with minimal CPU usage. nginx&apos;s sendfile
          implementation is configurable (sendfile on/off) and is enabled by default for
          production configurations.
        </p>

        <h3>Kafka: Message Delivery</h3>
        <p>
          Kafka uses transferTo() (Java&apos;s equivalent of sendfile()) to transfer message
          segments from the page cache to the network socket. When a consumer requests
          messages, Kafka reads the messages from the page cache and uses transferTo() to
          transfer them directly to the consumer&apos;s socket. This eliminates the CPU
          copies that would be required to copy messages from the page cache to the
          application buffer and from the application buffer to the socket buffer, enabling
          Kafka to achieve throughput of millions of messages per second per broker.
        </p>

        <h3>PostgreSQL: WAL Streaming Replication</h3>
        <p>
          PostgreSQL uses splice() to stream WAL records to replicas for replication. The
          WAL records are read from the WAL files and spliced directly to the replica&apos;s
          socket without copying data into user space. This enables efficient WAL streaming
          replication with minimal CPU overhead, reducing the replication lag and enabling
          near-real-time replica synchronization.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is zero-copy I/O and why is it important?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Zero-copy I/O eliminates unnecessary data copies between the kernel and user
              space during data transfer operations. Traditional I/O involves four data
              copies (2 DMA, 2 CPU) and four context switches. Zero-copy techniques
              (sendfile, mmap, splice) reduce this to 2 DMA copies and 2 context switches,
              eliminating CPU copies and reducing CPU usage by 50-75%.
            </p>
            <p>
              Zero-copy is important for high-throughput data-intensive applications (web
              servers, message brokers, databases) because it reduces CPU usage and improves
              throughput by 2-4x. Without zero-copy, these systems would be CPU-bound
              (limited by CPU cycles spent on data copies) rather than I/O-bound.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is the difference between sendfile(), mmap(), and splice()?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              sendfile() transfers data directly from a file descriptor to a socket descriptor
              within the kernel, eliminating user buffer copies (2 DMA copies only). mmap()
              maps a file into the process&apos;s address space, allowing in-place data
              processing (1 CPU copy from mapped memory to kernel socket buffer). splice()
              transfers data between any two file descriptors without copying data into user
              space, using a pipe buffer as an intermediary (2 DMA copies).
            </p>
            <p>
              Use sendfile() for file-to-socket transfers (static files), mmap() for
              applications that need to process data before sending (compression, encryption),
              and splice() for socket-to-socket transfers (network proxies, database
              replication).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How does Kafka use zero-copy?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Kafka uses transferTo() (Java&apos;s sendfile equivalent) to transfer message
              segments from the page cache to the network socket. Messages are written to
              the page cache by producers and read from the page cache by consumers using
              transferTo(), which transfers data directly from the page cache to the socket
              without copying data into the application buffer.
            </p>
            <p>
              This eliminates two CPU copies (page cache to application buffer, application
              buffer to socket buffer), reducing CPU usage by 50-75% and enabling Kafka to
              achieve throughput of millions of messages per second per broker with minimal
              CPU usage.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: When should you NOT use zero-copy?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Do not use zero-copy for small files (less than 4 KB). For small files, the
              overhead of the zero-copy system call (context switch, kernel processing)
              exceeds the savings from eliminating the CPU copies. For small files,
              traditional I/O (read + write) is faster because the data fits in the CPU
              cache and the copies are fast.
            </p>
            <p>
              Do not use zero-copy on file systems that do not support it (some network
              file systems like NFS, CIFS). The kernel falls back to traditional I/O
              silently, and the application may not be aware that zero-copy is not being
              used. Check the file system type before using zero-copy.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What is io_uring and how does it relate to zero-copy?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              io_uring is a Linux kernel interface for asynchronous I/O that provides a
              more efficient alternative to traditional system calls (read, write, sendfile).
              io_uring uses a ring buffer to submit I/O requests and receive completions,
              eliminating the context switch overhead of system calls. io_uring supports
              zero-copy operations (IORING_OP_SPLICE for splice, IORING_OP_SEND for
              sendfile-like transfers).
            </p>
            <p>
              io_uring is particularly effective for high-throughput, low-latency I/O
              workloads (databases, message brokers, web servers) because it eliminates
              both the CPU copy overhead (zero-copy) and the context switch overhead
              (asynchronous submission). io_uring is used by modern databases (ScyllaDB)
              and web servers (Caddy) for high-performance I/O.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How would you design a high-throughput file server using zero-copy?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use sendfile() for large files (&gt; 4 KB) and traditional I/O for small files
              (&lt;= 4 KB). Implement a thread pool that handles client requests: for each
              request, open the file, determine its size, and call sendfile() if the file
              is large enough. Handle partial transfers by checking the return value and
              retrying.
            </p>
            <p>
              For concurrent access, use non-blocking I/O with epoll (Linux) or kqueue
              (macOS/BSD) to handle multiple connections efficiently. For the highest
              throughput, use io_uring to eliminate context switch overhead. Monitor CPU
              usage and throughput to verify that zero-copy is providing the expected
              improvement (50-75% CPU reduction, 2-4x throughput improvement).
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.linuxjournal.com/article/6345"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Linux Journal: Zero-Copy I/O
            </a>{" "}
            — Comprehensive overview of zero-copy techniques in Linux.
          </li>
          <li>
            <a
              href="https://nginx.org/en/docs/http/ngx_http_core_module.html#sendfile"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              nginx: sendfile Directive
            </a>{" "}
            — How nginx uses sendfile() for static file serving.
          </li>
          <li>
            <a
              href="https://kafka.apache.org/documentation/#design"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kafka: Design — Zero-Copy
            </a>{" "}
            — How Kafka uses transferTo() for zero-copy message delivery.
          </li>
          <li>
            <a
              href="https://man7.org/linux/man-pages/man2/splice.2.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Linux Man Page: splice(2)
            </a>{" "}
            — splice() system call for zero-copy data transfer between file descriptors.
          </li>
          <li>
            Martin Kleppmann,{" "}
            <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017. Chapter 11
            (Stream Processing).
          </li>
          <li>
            <a
              href="https://kernel.dk/io_uring.pdf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              io_uring: High-Performance Asynchronous I/O
            </a>{" "}
              — The io_uring interface for asynchronous, zero-copy I/O.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
