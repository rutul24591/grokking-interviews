-- View and materialized view for reporting.

CREATE VIEW sales_totals AS
SELECT region, SUM(amount_cents) AS total_cents
FROM sales
GROUP BY region;

CREATE MATERIALIZED VIEW sales_totals_mv AS
SELECT region, SUM(amount_cents) AS total_cents
FROM sales
GROUP BY region;
