# Encoding vs sanitizing

In the context of XSS Injection Protection (xss, injection, protection), this example provides a focused implementation of the concept below.

Encoding (escaping) is the safest default when you don’t need HTML.

Sanitizing is necessary only when you deliberately allow HTML—and it must be robust and well-tested.

