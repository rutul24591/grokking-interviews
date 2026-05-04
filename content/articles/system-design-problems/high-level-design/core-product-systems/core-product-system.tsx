import React from 'react';

const CoreProductSystem = () => {
  return (
    <div>
      # Problem Context & Scope Definition

      ## Problem Statement
      - The system needs to handle a large number of users (DAU: 10,000, RPS: 500) and provide real-time data updates.

      ## Business Context
      - Users are businesses that need to monitor their inventory in real-time.
      - The system must ensure high availability and low latency for critical operations.

      ## Assumptions
      - Traffic (DAU: 10,000, RPS: 500)
      - Data scale: Inventory data for 10,000 businesses
      - Constraints: Must be highly available and responsive

---

# Functional Requirements (FRs)

## 2.1 Core Features (Must-have)
- Real-time inventory updates
- User authentication and authorization
- Data validation and error handling

## 2.2 Secondary Features (Nice-to-have)
- Historical data retrieval
- Notifications for stock changes

## 2.3 Out of Scope (Very important for interviews)
- Offline functionality
- Multi-language support

---

# 3. 📊 Non-Functional Requirements (NFRs)

## 3.1 Scalability
- Horizontal scaling to handle high RPS
- Load balancing across multiple instances

## 3.2 Availability
- 99.9% uptime SLA
- Multi-region failover for disaster recovery

## 3.3 Consistency
- Strong consistency model for real-time updates
- Data replication across regions

## 3.4 Performance (Latency, Throughput)
- Latency < 100ms for all operations
- Throughput of at least 500 RPS

## 3.5 Reliability
- Retry strategies for failed requests
- Circuit breakers to prevent cascading failures

## 3.6 Security
- OAuth2 authentication and authorization
- Rate limiting to prevent abuse
- Data encryption both in transit and at rest

## 3.7 Accessibility (WCAG, usability, inclusive design)
- WCAG compliance for all UI elements
- User-friendly error messages

## 3.8 Observability (Logging, Monitoring, Tracing)
- Detailed logging of all operations
- Real-time monitoring of system performance
- Distributed tracing for debugging

## 3.9 Maintainability
- Modular architecture for easy updates and maintenance
- Version control for code changes

## 3.10 Extensibility
- Support for new features through plugins or extensions

---

# 4. 🧱 High-Level Architecture

## 4.1 System Components
- Client (Web/Mobile)
- API Gateway
- Inventory Service
- User Management Service
- Database (PostgreSQL)
- Cache (Redis)
- Queue (RabbitMQ)

## 4.2 Architecture Diagram
