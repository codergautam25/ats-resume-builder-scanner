const rawUserText = `429.6679545971678Bangalore 492.374979484375+91-7980876391
33.74999859375Gautam Das
357.2577976142578Linkedin 399.64451834814435Github 434.87107938037093Leetcode 480.76170246826155Hackerrank 535.7812276757812Scaler
435.16404436816407gautamdas251998@gmail.com
33.74999859375 33.74999859375Skills
33.74999859375 33.74999859375• 45.01171687451172Python, Java, Flask, Kafka, AWS, New Relic, SQL Server, Microservices, PySpark, Python Libraries
33.74999859375 33.74999859375Experience
482.84763988134745Nov 2024 - Present
33.74999859375 33.74999859375Package App Development Senior Analyst
33.74999859375 33.74999859375Accenture
52.4999978125 52.4999978125Built observability pipelines using PySpark and OpenTelemetry, forwarding metrics to New Relic for real-
52.4999978125time monitoring and alerting
52.4999978125Developed custom New Relic dashboards and NRQL queries, improving debugging efficiency and reducing
52.4999978125mean time to resolution (MTTR)
52.4999978125Deployed solutions on AWS (EC2, EMR, Secrets Manager), improving monitoring reliability and system
52.4999978125scalability
52.4999978125Built Dockerized microservices and RESTful APIs, enabling scalable, loosely coupled communication and
52.4999978125consistent deployments
52.4999978125Implemented Kafka producers and consumers with Schema Registry (Avro) for high-throughput, type-safe
52.4999978125event-driven communication
52.4999978125Engineered scalable data processing systems using Core Java and multithreading, improving backend
52.4999978125performance by 30%
33.74999859375 33.74999859375Senior Software Developer 476.7538901352537Jun 2021 - Nov 2024
33.74999859375 33.74999859375Zeomega Infotech Pvt Ltd
52.4999978125 52.4999978125Constructed high-availability clusters with Confluent and Apache Kafka on RHEL and Ubuntu servers,
52.4999978125enhancing system reliability.
52.4999978125Integrated Debezium plugin with Snowflakes to optimize CDC data flow, improving data processing
52.4999978125efficiency.
52.4999978125Integrated Kafka with SQL Server for real-time data ingestion. This ensures high-throughput and reliable data
52.4999978125persistence.
52.4999978125Activated log compaction and partitioning in Kafka, achieving a 20% performance boost in data handling.
52.4999978125Deployed Debezium and Snowflakes Plugin Connectors, facilitating seamless CDC data integration and
52.4999978125achieving 90% data extraction efficiency.
52.4999978125Automated dynamic update scripting for worklist data, producing deltas every 5 seconds to enhance data
52.4999978125management.
52.4999978125Transformed Zope framework monolithic module into Flask microservices, resulting in a 95% increase in
52.4999978125application efficiency.
52.4999978125Migrated Python 2 codebase to Python 3. This ensures modernization and compliance with current coding
52.4999978125standards.
33.74999859375 33.74999859375Android Developer 474.77341771777344Mar 2021 - May 2021
33.74999859375 33.74999859375WeGrow Together
52.4999978125 52.4999978125Built Android app integrating Firebase Auth, Google Maps, Google Pay & Firebase Realtime DB, achieving
52.499997812580% data-handling efficienc
33.74999859375 33.74999859375Projects
33.74999859375 33.74999859375Prompt Optimizer Agent
46.4999980625 46.4999980625https://github.com/codergautam25/prompt-optimizer-local
292.5156615368469using MCP, enabling secure, offline enhancement of 52.4999978125 52.4999978125Built a 85.19530895019531local-first AI prompt optimization engine
52.4999978125LLM prompts with zero data exposure
109.35937044335937context-aware transformation pipeline 305.32425850315536applying 50+ prompt engineering techniques to 52.4999978125Designed a
52.4999978125improve response accuracy and structure
52.4999978125Integrated with AI developer tools like Claude Desktop and Cursor, enabling seamless adoption across
52.4999978125developer workflows
220.86327579736312automating prompt engineering best practices at scale 497.8945142543943, reducing 52.4999978125Improved developer productivity by
52.4999978125manual effort and increasing output quality
33.74999859375 33.74999859375Education
33.74999859375 33.74999859375Maulana Abul Kalam Azad University Of Technology
33.74999859375 33.74999859375MCA/BCA
33.74999859375 33.74999859375Key Courses / Certification
52.4999978125 52.4999978125Apache Kafka Certified
52.4999978125Spring MVC & ADV. Java Programming
52.4999978125Docker Certified Associate
52.4999978125Git and GitHub Training
https://www.linkedin.com/in/gautam-das-054417131/
https://github.com/codergautam25
https://leetcode.com/u/gautam_user/
https://www.hackerrank.com/Bob_98
https://scaler.com/academy/profile/d2ee4447edf5
https://github.com/codergautam25/prompt-optimizer-local`;

function stripPdfCoordinateNoise(text: string): string {
  if (!text) return '';
  let cleaned = text;
  // 1. Strip floating-point coordinate numbers e.g. 429.6679545971678, 33.74999859375, 492.374979484375
  cleaned = cleaned.replace(/\b\d{2,}\.\d{3,}\b/g, ' ');
  // 2. Strip attached floating-point numbers prefixed to letters/bullets e.g. 429.6679545971678Bangalore, 45.01171687451172Python
  cleaned = cleaned.replace(/\d{2,}\.\d{3,}(?=[a-zA-Z•+\/])/g, ' ');
  // 3. Strip standalone multi-digit integer coordinate prefixes on lines e.g. 16797, 610.8398
  cleaned = cleaned.replace(/^\d{4,}\s+\d+\.\d+/gm, '');
  // 4. Normalise duplicate spaces & multi-newlines
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned.trim();
}

console.log('Cleaned Text:');
console.log(stripPdfCoordinateNoise(rawUserText));
