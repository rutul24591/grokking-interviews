import React from 'react';

const SocialMediaNewsFeed: React.FC = () => {
  return (
    <div>
      {/* Problem Context & Scope Definition */}
      <h2>Problem Context & Scope Definition</h2>
      <p><strong>Problem Statement:</strong> Design the frontend for a social media news feed.</p>
      <p><strong>Business Context:</strong> Users will interact with their news feed, view posts, and engage with content.</p>
      <p><strong>Assumptions:</strong></p>
      <ul>
        <li>Traffic: 10M DAU</li>
        <li>Data scale: 1B+ posts per day</li>
        <li>Constraints: Low-latency, high availability</li>
      </ul>

      {/* Functional Requirements (FRs) */}
      <h2>Functional Requirements (FRs)</h2>
      <h3>2.1 Core Features (Must-have)</h3>
      <ul>
        <li>Real-time post updates</li>
        <li>Infinite scrolling for older posts</li>
        <li>Commenting and liking functionality</li>
        <li>Notification system for new comments/likes</li>
      </ul>

      {/* Non-Functional Requirements (NFRs) */}
      <h2>Non-Functional Requirements (NFRs)</h2>
      <h3>3.1 Scalability</h3>
      <p>The system must handle 10M DAU and 1B+ posts per day.</p>

      {/* High-Level Architecture */}
      <h2>High-Level Architecture</h2>
      <p><strong>System Components:</strong></p>
      <ul>
        <li>Client (React)</li>
        <li>API Gateway</li>
        <li>News Feed Service</li>
        <li>Comment/Like Service</li>
        <li>Notification Service</li>
        <li>Database (PostgreSQL, Redis)</li>
      </ul>

      {/* Core Workflows (Sequence Flows) */}
      <h2>Core Workflows (Sequence Flows)</h2>
      <h3>5.1 Primary Flow</h3>
      <ol>
        <li>User opens the news feed page.</li>
        <li>API Gateway fetches posts from News Feed Service.</li>
        <li>News Feed Service retrieves posts from Database.</li>
        <li>Posts are returned to API Gateway and then to Client.</li>
        <li>Client renders the posts in a list.</li>
      </ol>

      {/* Data Modeling */}
      <h2>Data Modeling</h2>
      <h3>6.1 Entities</h3>
      <ul>
        <li>User (id, username, email)</li>
        <li>Post (id, content, authorId, createdAt)</li>
        <li>Comment (id, postId, userId, content, createdAt)</li>
        <li>Like (id, postId, userId, createdAt)</li>
      </ul>

      {/* Scalability Deep Dive */}
      <h2>Scalability Deep Dive</h2>
      <h3>7.1 Read Scaling</h3>
      <p>Use sharding and replication to distribute read load.</p>

      {/* Performance Optimization */}
      <h2>Performance Optimization</h2>
      <p>Caching frequently accessed posts in Redis.</p>

      {/* Security Design */}
      <h2>Security Design</h2>
      <p>JWT-based authentication for user sessions.</p>

      {/* Reliability & Fault Tolerance */}
      <h2>Reliability & Fault Tolerance</h2>
      <p>Circuit breakers and retries for API calls.</p>

      {/* Observability & Monitoring */}
      <h2>Observability & Monitoring</h2>
      <p>Metrics for latency, error rate, throughput.</p>

      {/* Trade-offs & Design Decisions */}
      <h2>Trade-offs & Design Decisions</h2>
      <ul>
        <li><strong>Option 1:</strong> Monolithic architecture vs Microservices. Chosen: Microservices due to scalability and maintainability.</li>
        <li><strong>Option 2:</strong> Real-time updates via polling vs WebSockets. Chosen: WebSockets for real-time updates.</li>
      </ul>

      {/* Capacity Estimation */}
      <h2>Capacity Estimation</h2>
      <p>Users: 10M DAU, RPS: 50k, Storage: 1TB/day, Bandwidth: 1Gbps</p>

      {/* Bottlenecks & Mitigations */}
      <h2>Bottlenecks & Mitigations</h2>
      <ul>
        <li>Database read/write bottlenecks: Use sharding and replication.</li>
        <li>Network latency: Use CDN for static assets.</li>
      </ul>

      {/* Advanced Topics */}
      <h2>Advanced Topics</h2>
      <p><strong>15.1 Multi-region Deployment:</strong> Deploy services across regions to improve availability.</p>

      {/* Evolution Path */}
      <h2>Evolution Path</h2>
      <p>MVP → Scale (sharding, replication) → Global deployment (multi-region)</p>

      {/* Interview Tips */}
      <h2>Interview Tips</h2>
      <ul>
        <li><strong>What interviewer is looking for:</strong> Understanding of system architecture, scalability, and performance optimization.</li>
        <li><strong>Common mistakes:</strong> Overcomplicating the design or ignoring key requirements.</li>
        <li><strong>How to present solution:</strong> Clearly explain each component, its role, and how they interact.</li>
      </ul>

      {/* Interview Q&A */}
      <h2>Interview Q&A</h2>
      <ol>
        <li><strong>Q1:</strong> What are the key components of your design? <strong>A1:</strong> Client, API Gateway, News Feed Service, Comment/Like Service, Notification Service, Database.</li>
        <li><strong>Q2:</strong> How will you handle real-time updates? <strong>A2:</strong> Use WebSockets for real-time updates.</li>
        <li><strong>Q3:</strong> What measures have you taken to ensure scalability? <strong>A3:</strong> Sharding, replication, and caching.</li>
        <li><strong>Q4:</strong> How will you monitor the system's performance? <strong>A4:</strong> Metrics for latency, error rate, throughput.</li>
        <li><strong>Q5:</strong> What are some potential bottlenecks in your design? <strong>A5:</strong> Database read/write bottlenecks and network latency.</li>
      </ol>

      {/* Summary */}
      <h2>Summary</h2>
      <p>The designed system for a social media news feed is scalable, secure, and optimized for performance. It uses microservices architecture, real-time updates via WebSockets, and caching to handle high traffic and data scale.</p>
    </div>
  );
};

export default SocialMediaNewsFeed;
