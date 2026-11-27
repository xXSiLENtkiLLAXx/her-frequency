# Security rules

- Create event registrations only through the validated registration function; it rate-limits requests and generates payment confirmation tokens, so direct public inserts stay disabled.
- Allow public testimonial submissions only while unapproved; this preserves reviews while keeping publication under administrator moderation.
- Load homepage gallery media from the existing public gallery records and shuffle it on fetch, so new uploads appear without manual ordering.