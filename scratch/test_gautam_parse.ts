import { parseResumeTextToStructuredData } from '../src/utils/resumeParser';
import { sanitizeAndFixResumeData } from '../src/utils/resumeSanitizer';

const sampleResume = `Gautam Das
Bangalore +91-7980876391
Linkedin Github Leetcode Hackerrank Scaler
435.16404436816407gautamdas251998@gmail.com
Skills
• Python, Java, Flask, Kafka, AWS, New Relic, SQL Server, Microservices, PySpark, Python Libraries
Experience
Package App Development Senior Analyst Nov 2024 - Present
Accenture
• Built observability pipelines using PySpark and OpenTelemetry, forwarding metrics to New Relic for real-time monitoring and alerting
• Developed custom New Relic dashboards and NRQL queries, improving debugging efficiency and reducing mean time to resolution (MTTR)
• Deployed solutions on AWS (EC2, EMR, Secrets Manager), improving monitoring reliability and system scalability
• Built Dockerized microservices and RESTful APIs, enabling scalable, loosely coupled communication and consistent deployments
• Implemented Kafka producers and consumers with Schema Registry (Avro) for high-throughput, type-safe event-driven communication
• Engineered scalable data processing systems using Core Java and multithreading, improving backend performance by 30%

Senior Software Developer Jun 2021 - Nov 2024
Zeomega Infotech Pvt Ltd
• Constructed high-availability clusters with Confluent and Apache Kafka on RHEL and Ubuntu servers, enhancing system reliability.
• Integrated Debezium plugin with Snowflakes to optimize CDC data flow, improving data processing efficiency.
• Integrated Kafka with SQL Server for real-time data ingestion, ensuring high-throughput and reliable data persistence.
• Activated log compaction and partitioning in Kafka, achieving a 20% performance boost in data handling.
• Deployed Debezium and Snowflakes Plugin Connectors, facilitating seamless CDC data integration and achieving 90% data extraction efficiency.
• Automated dynamic update scripting for worklist data, producing deltas every 5 seconds to enhance data management.
• Transformed Zope framework monolithic module into Flask microservices, resulting in a 95% increase in application efficiency.
• Migrated Python 2 codebase to Python 3, ensuring modernization and compliance with current coding standards.

Android Developer Mar 2021 - May 2021
WeGrow Together
• Built Android app integrating Firebase Auth, Google Maps, Google Pay & Firebase Realtime DB, achieving 80% data-handling efficiency

Projects
Prompt Optimizer Agent
https://github.com/codergautam25/prompt-optimizer-local
• Built a local-first AI prompt optimization engine using MCP, enabling secure, offline enhancement of LLM prompts with zero data exposure
• Designed a context-aware transformation pipeline applying 50+ prompt engineering techniques to improve response accuracy and structure
• Integrated with AI developer tools like Claude Desktop and Cursor, enabling seamless adoption across developer workflows
• Improved developer productivity by automating prompt engineering best practices at scale, reducing manual effort and increasing output quality

Education
Maulana Abul Kalam Azad University Of Technology 2020
MCA/BCA

Key Courses / Certification
Apache Kafka Certified
Spring MVC & ADV. Java Programming
Docker Certified Associate
Git and GitHub Training`;

const parsed = parseResumeTextToStructuredData(sampleResume);
const sanitized = sanitizeAndFixResumeData(parsed);

console.log('Sanitized Personal Info:', JSON.stringify(sanitized.personalInfo, null, 2));
console.log('Sanitized Experience Jobs:', sanitized.experience.length);
console.log('Sanitized Skills Categories:', sanitized.skillCategories.length);
console.log('Sanitized Projects:', sanitized.projects.length);
console.log('Sanitized Education:', sanitized.education.length);
console.log('Sanitized Certifications:', sanitized.certifications.length);
