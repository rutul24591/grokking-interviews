"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-frontend-booking-workflows",
  title: "Booking Workflows",
  description:
    "Comprehensive guide to implementing booking workflows covering service selection, availability checking, time slot booking, resource allocation, confirmation flows, and calendar integration for appointments, reservations, and service bookings.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "booking-workflows",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "booking",
    "appointments",
    "frontend",
    "scheduling",
    "reservations",
  ],
  relatedTopics: ["checkout-flow", "payment-ui", "confirmation-screens", "calendar-integration"],
};

export default function BookingWorkflowsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Booking workflows enable customers to book services, appointments, and reservations: select service, check availability, choose time slot, provide details, confirm booking, and receive confirmation. Unlike product checkout (tangible goods), booking workflows involve intangible services with time-based inventory (appointments, hotel rooms, restaurant tables, rental cars). A well-designed booking workflow reduces abandonment (clear availability, fast booking), prevents double-booking (real-time inventory), and sets expectations (confirmation, reminders). For staff and principal engineers, booking workflows involve availability management (real-time inventory), time slot optimization (maximize utilization), and integration with external calendars (Google Calendar, Outlook, iCal).
        </p>
        <p>
          The complexity of booking workflows extends beyond simple form submission. Availability checking must be real-time (prevent double-booking), handle time zones (customer in different timezone), and respect business rules (minimum notice, booking windows, blackout dates). Time slot selection must show available slots (grouped by day), handle duration (30 min, 1 hour, multi-day), and buffer time (cleaning between appointments). Resource allocation must assign staff (specific stylist, any available), rooms (conference room A, any room), or equipment (projector, specific vehicle). The workflow must handle edge cases (overlapping bookings, staff unavailability, holiday closures) gracefully with clear messaging.
        </p>
        <p>
          For staff and principal engineers, booking workflow architecture involves backend integration (availability API, booking API, calendar API), state management (pending booking, confirmed booking, cancelled booking), and notification delivery (confirmation email, SMS reminder, calendar invite). Analytics track booking conversion (view to booking), no-show rate (booked but didn&apos;t show), cancellation rate (booked then cancelled), and peak times (busiest days/times). The system must support multiple booking types (appointment, reservation, rental), multiple resources (staff, rooms, equipment), and multiple booking channels (web, mobile, phone, walk-in).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Service Selection</h3>
        <p>
          Service catalog shows available services. Categories: hair services (cut, color, styling), spa services (massage, facial, body), professional services (consulting, legal, medical), hospitality (hotel rooms, restaurant tables, rental cars). Display: service name, description, duration (30 min, 1 hour), price ($50, $100+), staff requirement (any staff, specific staff). Grouping: by category (hair, spa, nails), by duration (quick services, full services), by price (budget, premium).
        </p>
        <p>
          Service details provide booking context. Description: what&apos;s included (haircut includes wash, style), prerequisites (patch test for color), what to bring (ID for rental, insurance for medical). Duration: service time (30 min), buffer time (10 min cleaning), total time (40 min). Price: base price ($50), add-ons (+$20 for deep conditioning), tips (suggested 15-20%). Display: service page (detailed info), modal (quick view), tooltip (quick info).
        </p>
        <p>
          Staff selection assigns specific staff or any available. Specific staff: customer preference (my stylist, Dr. Smith), staff profile (photo, bio, reviews, availability). Any available: first available (maximize utilization), match by skill (color specialist, Spanish-speaking). Display: staff list (photo, name, specialty), availability calendar (when available), reviews (rating, comments).
        </p>

        <h3 className="mt-6">Availability Checking</h3>
        <p>
          Real-time availability prevents double-booking. Check: service duration fits in slot, staff available (not booked, not on break), room/equipment available (if required). Display: available slots (green), unavailable (gray, tooltip why), partially available (limited staff). Refresh: auto-refresh (every 30 seconds), manual refresh (button), notification when slot available (waitlist).
        </p>
        <p>
          Time zone handling supports remote bookings. Customer timezone: detect from browser, manual selection (dropdown). Business timezone: stored in business settings, displayed (all times in EST). Conversion: show customer local time (convert from business timezone), daylight saving adjustment (automatic). Display: &quot;All times shown in your local time (PST)&quot;, timezone selector (change timezone).
        </p>
        <p>
          Business rules enforce booking policies. Minimum notice: book at least 2 hours ahead (no last-minute), 24 hours ahead (day before). Booking window: book up to 30 days ahead, 90 days ahead (premium customers). Blackout dates: holidays (closed), staff training (limited services), private events (closed to public). Display: &quot;Next available: Tomorrow 10 AM&quot;, &quot;Booking opens 30 days ahead&quot;, &quot;Closed on Thanksgiving&quot;.
        </p>

        <h3 className="mt-6">Time Slot Selection</h3>
        <p>
          Calendar view shows available dates. Views: month view (available dates highlighted), week view (available slots per day), day view (all slots for selected day). Navigation: previous/next (month, week), today (jump to today), date picker (select specific date). Display: available dates (green dot), fully booked (gray), partially available (yellow, limited slots).
        </p>
        <p>
          Time slot display shows available times. Grouping: by day (Today, Tomorrow, Wed Dec 18), by time of day (Morning, Afternoon, Evening). Format: 12-hour (9:00 AM, 2:30 PM), 24-hour (09:00, 14:30). Duration: show duration (30 min, 1 hour), end time (9:00-9:30 AM). Display: buttons (click to select), color-coded (green available, gray unavailable), grouped (by day, by time).
        </p>
        <p>
          Multi-slot booking handles multi-part services. Sequential slots: haircut (30 min) + color (1 hour) = 1.5 hours contiguous. Non-sequential: consultation (30 min today) + service (1 hour next week). Multi-day: hotel (3 nights), rental car (5 days). Display: &quot;Select start time&quot; (auto-calculate end), &quot;Select multiple slots&quot; (hold all before confirm), &quot;Select date range&quot; (check-in to check-out).
        </p>

        <h3 className="mt-6">Booking Details</h3>
        <p>
          Customer information captures booking details. Required: name (first, last), contact (email, phone), notes (special requests, allergies). Optional: company (business booking), referral (how heard about us), preferences (specific staff, room temperature). Returning customers: auto-fill (saved info), update info (change email/phone). Display: form (required fields marked), progress indicator (step 1 of 3), save info (for next booking).
        </p>
        <p>
          Payment handling collects payment or hold. Prepayment: pay now (credit card, PayPal), deposit (50% now, rest later). Hold: no payment (pay at service), card on file (hold for no-show). Cancellation policy: free cancellation (24 hours ahead), fee after (50% fee), no refund (non-refundable rate). Display: &quot;Pay now: $100&quot;, &quot;Hold with card&quot;, &quot;Free cancellation until 24 hours before&quot;.
        </p>
        <p>
          Confirmation preferences set notification preferences. Confirmation: email (always), SMS (opt-in), phone call (high-value bookings). Reminders: 24 hours before (email/SMS), 2 hours before (SMS), day before (email). Calendar invite: Google Calendar, Outlook, iCal (add to calendar). Display: checkboxes (email, SMS, calendar), frequency (how many reminders), timezone (for reminders).
        </p>

        <h3 className="mt-6">Booking Management</h3>
        <p>
          Booking confirmation confirms booking details. Content: booking number (reference), service (what booked), date/time (when), location (where), staff (who), price (how much), cancellation policy (terms). Delivery: email (detailed confirmation), SMS (summary with link), app notification (push notification). Calendar invite: .ics file (add to calendar), Google Calendar link, Outlook link. Display: confirmation page (print/save), email (detailed), SMS (summary).
        </p>
        <p>
          Booking modification allows changes to booking. Changes: reschedule (different date/time), cancel (with/without fee), modify service (upgrade/downgrade), change staff (different stylist). Restrictions: free changes (24+ hours ahead), fee after (50% fee), no changes (non-refundable). Display: &quot;Modify Booking&quot; button, available alternatives (other slots), price difference (upgrade cost).
        </p>
        <p>
          No-show handling manages missed appointments. Definition: didn&apos;t show (no cancellation, no show), late show (showed after grace period). Policy: charge fee (no-show fee), release slot (after 15 min grace), mark as no-show (track history). Prevention: reminders (24 hours, 2 hours), confirmation required (reply to confirm), deposit (lose deposit if no-show). Display: &quot;You&apos;ve been marked as no-show&quot;, &quot;No-show fee: $50&quot;, &quot;Please arrive 10 minutes early&quot;.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Booking workflow architecture spans service selection, availability checking, booking creation, and confirmation. Service selection shows available services (catalog, staff). Availability checking checks real-time availability (slots, staff, rooms). Booking creation captures details (customer, payment, preferences). Confirmation delivers confirmation (email, SMS, calendar).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/booking-workflows/booking-workflow-architecture.svg"
          alt="Booking Workflow Architecture"
          caption="Figure 1: Booking Workflow Architecture — Service selection, availability checking, booking creation, and confirmation"
          width={1000}
          height={500}
        />

        <h3>Service Selection Component</h3>
        <p>
          Service catalog displays available services. Data source: service API (fetch services, categories, staff). Filtering: by category (hair, spa, nails), by duration (quick, full), by price (budget, premium), by staff (specific staff, any). Sorting: by popularity (most booked), by price (low to high), by duration (short to long). Display: grid (service cards), list (service list), categories (accordion).
        </p>
        <p>
          Staff selection shows available staff. Data source: staff API (fetch staff, profiles, availability). Filtering: by specialty (colorist, masseuse), by language (English, Spanish), by rating (4+ stars), by availability (today, this week). Sorting: by rating (highest first), by availability (most available), by popularity (most booked). Display: staff cards (photo, name, specialty), availability calendar (when available), reviews (rating, comments).
        </p>
        <p>
          Service details modal shows detailed info. Content: description (what&apos;s included), duration (service + buffer), price (base + add-ons), staff (who performs), reviews (customer reviews), FAQ (common questions). Actions: book now (start booking), add to cart (multiple services), save for later (wishlist). Display: modal (overlay), slide-out (side panel), dedicated page (full page).
        </p>

        <h3 className="mt-6">Availability Checking</h3>
        <p>
          Availability API checks real-time availability. Input: service ID, staff ID (optional), date range, duration. Output: available slots (date, time, duration), unavailable slots (reason: booked, staff unavailable, closed). Performance: cache results (30 seconds), incremental updates (only changed slots), background refresh (update while user browsing). Display: available slots (green buttons), unavailable (gray, tooltip), loading (skeleton slots).
        </p>
        <p>
          Time slot generation creates available slots. Input: business hours (9 AM - 6 PM), service duration (30 min), buffer time (10 min), existing bookings (blocked slots). Algorithm: generate slots (9:00, 9:40, 10:20), block booked slots, block staff breaks, block blackout dates. Output: available slots (array of times), partially available (limited staff), fully booked (no availability). Display: grouped by day (Today, Tomorrow), grouped by time (Morning, Afternoon).
        </p>
        <p>
          Hold mechanism reserves slot temporarily. Duration: 10 minutes (complete booking), 15 minutes (payment required). Purpose: prevent double-booking (slot held while booking), reduce abandonment (slot reserved). Expiry: auto-release (after 10 minutes), manual release (user cancels), booking complete (convert to booking). Display: &quot;Slot held for 9:45&quot;, countdown timer (&quot;09:59 remaining&quot;), warning (&quot;Complete booking before time expires&quot;).
        </p>

        <h3 className="mt-6">Booking Creation</h3>
        <p>
          Booking form captures customer details. Fields: name (first, last), contact (email, phone), notes (special requests), preferences (staff, room). Validation: required fields (name, email, phone), format validation (email format, phone format), business rules (minimum notice, booking window). Auto-fill: returning customers (saved info), browser auto-fill (saved addresses), pre-fill (from account). Display: multi-step (step 1: details, step 2: payment), single page (all fields), progress indicator (step 1 of 3).
        </p>
        <p>
          Payment processing collects payment or hold. Methods: credit card (Stripe, Braintree), PayPal, Apple Pay/Google Pay, pay later (invoice). Hold: card on file (authorize, don&apos;t capture), deposit (capture partial), full prepayment (capture full). Validation: card validation (Luhn, expiry), fraud check (AVS, CVV), 3D Secure (if required). Display: payment form (card fields), payment options (card, PayPal, Apple Pay), security badges (SSL, PCI).
        </p>
        <p>
          Booking confirmation creates booking record. Input: service ID, staff ID, date/time, customer details, payment info. Process: create booking (booking API), charge payment (payment API), send confirmation (notification API), add to calendar (calendar API). Output: booking number (reference), confirmation (email/SMS), calendar invite (.ics). Display: confirmation page (booking details, print/save), email (detailed confirmation), SMS (summary with link).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/booking-workflows/booking-flow.svg"
          alt="Booking Flow"
          caption="Figure 2: Booking Flow — Service selection, availability, details, payment, and confirmation"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Confirmation and Notifications</h3>
        <p>
          Confirmation email delivers booking details. Content: booking number, service details, date/time, location, staff, price, cancellation policy, modify/cancel links. Format: HTML (styled email), plain text (fallback), attachments (calendar invite, receipt). Delivery: immediate (on booking), retry on failure (3 attempts), bounce handling (invalid email). Display: &quot;Confirmation sent to email@example.com&quot;, &quot;Check spam folder&quot;, &quot;Resend confirmation&quot;.
        </p>
        <p>
          SMS reminders reduce no-shows. Timing: 24 hours before (confirm or reschedule), 2 hours before (reminder), day before (evening reminder). Content: booking summary (service, time), confirm link (reply YES), reschedule link (change time), cancel link (cancel booking). Opt-in: checkbox (receive SMS reminders), frequency (how many reminders), quiet hours (no SMS after 8 PM). Display: &quot;SMS reminders enabled&quot;, &quot;Reply YES to confirm&quot;, &quot;Text STOP to opt-out&quot;.
        </p>
        <p>
          Calendar integration adds booking to calendar. Formats: .ics file (download, add to any calendar), Google Calendar link (open in Google Calendar), Outlook link (open in Outlook). Content: event title (service name), date/time (start/end), location (address, room), description (booking details, notes), reminders (default calendar reminders). Display: &quot;Add to Calendar&quot; button, calendar options (Google, Outlook, iCal), auto-add (if logged in).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/booking-workflows/availability-calendar.svg"
          alt="Availability Calendar"
          caption="Figure 3: Availability Calendar — Date selection, time slots, and real-time availability"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Booking workflow design involves trade-offs between flexibility, conversion, operational efficiency, and customer experience. Understanding these trade-offs enables informed decisions aligned with business model and customer expectations.
        </p>

        <h3>Payment: Prepayment vs. Pay Later</h3>
        <p>
          Prepayment (pay now). Pros: Guaranteed revenue (paid upfront), lower no-show rate (financial commitment), cash flow (money upfront). Cons: Lower conversion (friction at booking), refund handling (cancellations require refund), customer preference (some prefer pay later). Best for: High-value services (wedding, multi-day), high no-show businesses (medical, consulting), peak times (holidays, weekends).
        </p>
        <p>
          Pay later (pay at service). Pros: Higher conversion (no payment friction), customer preference (pay after service), simpler (no refund handling). Cons: No-show risk (no financial commitment), revenue uncertainty (may not show), cash flow delay (paid later). Best for: Low-value services (haircut, quick service), low no-show businesses (regular customers), off-peak times (weekday mornings).
        </p>
        <p>
          Hybrid: deposit (partial prepayment). Pros: Balance commitment with conversion (some skin in game), lower no-show (deposit at risk), flexible (rest pay later). Cons: Complexity (partial payment, balance collection), refund handling (deposit refund policy). Best for: Most production systems—deposit for high-value, pay later for low-value.
        </p>

        <h3>Slot Holding: Hold vs. No Hold</h3>
        <p>
          Slot holding (reserve while booking). Pros: Prevent double-booking (slot reserved), better UX (don&apos;t lose slot while filling form), reduces abandonment (slot secured). Cons: Inventory lock-up (slots held but not booked), expiration handling (release after timeout), complexity (hold management). Best for: High-demand businesses (fully booked, competitive slots), multi-step booking (long forms).
        </p>
        <p>
          No holding (first to confirm). Pros: Maximum utilization (no locked slots), simpler (no hold management), fair (first-come-first-served). Cons: Double-booking risk (two users select same slot), frustration (lose slot at payment), higher abandonment (start over). Best for: Low-demand businesses (plenty of slots), simple booking (short forms).
        </p>
        <p>
          Hybrid: short hold (5-10 minutes). Pros: Balance utilization with UX (short hold time), prevent double-booking (brief hold), urgency (complete before expires). Cons: Still some lock-up (short duration), timeout handling (release expired). Best for: Most production systems—10 minute hold, countdown timer, auto-release.
        </p>

        <h3>Staff Assignment: Specific vs. Any</h3>
        <p>
          Specific staff (customer chooses). Pros: Customer preference (my stylist, Dr. Smith), loyalty (book same staff), higher satisfaction (known staff). Cons: Staff utilization imbalance (popular staff booked, others idle), limited availability (staff may not be available), complexity (staff schedules). Best for: Personal services (hair, medical, consulting), loyalty businesses (repeat customers).
        </p>
        <p>
          Any available (business assigns). Pros: Maximum utilization (balance across staff), more availability (any staff), simpler (no staff selection). Cons: Customer uncertainty (don&apos;t know who), lower loyalty (different staff each time), may not match preferences (language, specialty). Best for: Commodity services (massage, cleaning), high-volume businesses (chain salons).
        </p>
        <p>
          Hybrid: prefer staff (fallback to any). Pros: Customer preference (try for preferred), availability (fallback if unavailable), balance (loyalty with utilization). Cons: Complexity (preference + fallback), customer confusion (may not get preferred). Best for: Most production systems—select preferred, show availability, offer alternatives.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/booking-workflows/booking-types.svg"
          alt="Booking Types Comparison"
          caption="Figure 4: Booking Types Comparison — Appointment, reservation, and rental booking flows"
          width={1000}
          height={450}
        />

        <h3>Reminder Frequency: Many vs. Few</h3>
        <p>
          Many reminders (multiple touchpoints). Pros: Lower no-show (multiple reminders), confirmation opportunity (reply to confirm), customer convenience (add to calendar). Cons: Notification fatigue (too many messages), opt-out risk (stop reminders), cost (SMS costs add up). Best for: High no-show businesses (medical, consulting), high-value bookings (wedding, events).
        </p>
        <p>
          Few reminders (minimal touchpoints). Pros: Lower cost (fewer messages), less fatigue (not annoying), simpler (one reminder). Cons: Higher no-show (fewer touchpoints), no confirmation (don&apos;t know if coming), customer may forget (single reminder). Best for: Low no-show businesses (regular customers), low-cost reminders (email only).
        </p>
        <p>
          Hybrid: smart reminders (based on risk). Pros: Targeted (high-risk get more), cost-effective (low-risk get fewer), adaptive (learn from history). Cons: Complexity (risk scoring, segmentation), data required (booking history). Best for: Most production systems—24 hour reminder (all), 2 hour reminder (high-risk only).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Show real-time availability:</strong> Prevent double-booking (real-time API), show available slots (green), unavailable (gray). Auto-refresh (every 30 seconds), manual refresh (button). Hold slots temporarily (10 minutes).
          </li>
          <li>
            <strong>Handle time zones:</strong> Detect customer timezone (browser), show local times (convert from business timezone), daylight saving adjustment (automatic). Display: &quot;All times in your local time (PST)&quot;.
          </li>
          <li>
            <strong>Enforce business rules:</strong> Minimum notice (2 hours ahead), booking window (30 days ahead), blackout dates (holidays, closed). Display: &quot;Next available: Tomorrow 10 AM&quot;, &quot;Closed on Thanksgiving&quot;.
          </li>
          <li>
            <strong>Provide staff selection:</strong> Show staff profiles (photo, bio, reviews), availability (when available), specialty (what they do). Allow preference (my stylist), fallback (any available).
          </li>
          <li>
            <strong>Send confirmations:</strong> Email (detailed confirmation), SMS (summary with link), calendar invite (add to calendar). Include: booking number, service, date/time, location, staff, cancellation policy.
          </li>
          <li>
            <strong>Reduce no-shows:</strong> Reminders (24 hours, 2 hours), confirmation required (reply YES), deposit (financial commitment), no-show fee (deterrent).
          </li>
          <li>
            <strong>Enable modifications:</strong> Reschedule (different date/time), cancel (with/without fee), modify service (upgrade/downgrade). Display: &quot;Modify Booking&quot; button, available alternatives, price difference.
          </li>
          <li>
            <strong>Optimize for mobile:</strong> Touch-friendly slots (large buttons), mobile calendar (swipe dates), SMS reminders (opt-in), mobile payment (Apple Pay, Google Pay).
          </li>
          <li>
            <strong>Handle multi-slot bookings:</strong> Sequential (haircut + color), non-sequential (consultation + service), multi-day (hotel, rental). Display: &quot;Select start time&quot; (auto-calculate end), &quot;Select date range&quot;.
          </li>
          <li>
            <strong>Track booking analytics:</strong> Conversion rate (view to booking), no-show rate (booked but didn&apos;t show), cancellation rate (booked then cancelled), peak times (busiest days/times).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No real-time availability:</strong> Double-booking occurs. Solution: Real-time API, slot holding (10 minutes), auto-refresh (every 30 seconds).
          </li>
          <li>
            <strong>No timezone handling:</strong> Customer books wrong time. Solution: Detect timezone, show local times, display timezone (&quot;All times in PST&quot;).
          </li>
          <li>
            <strong>No business rules:</strong> Last-minute bookings, overbooking. Solution: Minimum notice, booking window, blackout dates, maximum bookings per slot.
          </li>
          <li>
            <strong>No staff selection:</strong> Customer gets random staff. Solution: Staff profiles, availability, specialty, preference selection.
          </li>
          <li>
            <strong>No confirmation:</strong> Customer unsure if booked. Solution: Confirmation email, SMS, calendar invite, booking number.
          </li>
          <li>
            <strong>No reminders:</strong> High no-show rate. Solution: 24 hour reminder, 2 hour reminder, confirmation required (reply YES).
          </li>
          <li>
            <strong>No modification option:</strong> Can&apos;t reschedule or cancel. Solution: &quot;Modify Booking&quot; link, reschedule (other slots), cancel (with/without fee).
          </li>
          <li>
            <strong>Poor mobile support:</strong> Can&apos;t book on mobile. Solution: Touch-friendly slots, mobile calendar, SMS reminders, mobile payment.
          </li>
          <li>
            <strong>No multi-slot support:</strong> Can&apos;t book multi-part services. Solution: Sequential slots, non-sequential, multi-day (date range).
          </li>
          <li>
            <strong>No analytics:</strong> Don&apos;t know booking performance. Solution: Track conversion, no-show rate, cancellation rate, peak times.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>OpenTable Restaurant Reservations</h3>
        <p>
          OpenTable: restaurant booking platform. Features: select restaurant, date, party size, time slot. Real-time availability (table inventory), instant confirmation (email/SMS). Reminders: 24 hour reminder, day-of reminder. Modifications: reschedule (different time), cancel (free until 24 hours). No-show: restaurant marks no-show, penalty (can&apos;t book for period).
        </p>

        <h3 className="mt-6">Zocdoc Medical Appointments</h3>
        <p>
          Zocdoc: medical appointment booking. Features: select specialty (dermatology, primary care), insurance accepted, location, date/time. Real-time availability (doctor schedules), instant confirmation (email/SMS). Reminders: 24 hour reminder, 2 hour reminder (SMS). Modifications: reschedule (other doctors), cancel (free until 24 hours). No-show: marked in system, may affect future bookings.
        </p>

        <h3 className="mt-6">Airbnb Vacation Rentals</h3>
        <p>
          Airbnb: vacation rental booking. Features: select property, dates (check-in/out), guests, instant book or request. Real-time availability (calendar sync), payment (full or deposit). Confirmation: email (detailed), calendar invite. Modifications: reschedule (if host allows), cancel (per cancellation policy). No-show: lose payment, host can rebook.
        </p>

        <h3 className="mt-6">Mindbody Fitness Classes</h3>
        <p>
          Mindbody: fitness class booking. Features: select studio, class type (yoga, spin), instructor, date/time. Real-time availability (class capacity), waitlist (if full). Reminders: 12 hour reminder, 2 hour reminder. Modifications: cancel (free until 12 hours), late cancel (fee), no-show (lose class credit). Capacity: max class size, waitlist auto-promote.
        </p>

        <h3 className="mt-6">Enterprise Car Rental</h3>
        <p>
          Enterprise: car rental booking. Features: select location, dates (pick-up/return), car class (economy, SUV), extras (GPS, insurance). Real-time availability (fleet inventory), pay now or later. Confirmation: email (reservation number), add to calendar. Modifications: reschedule (change dates), cancel (free until pick-up). No-show: reservation cancelled after grace period.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent double-booking?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Real-time availability API (check before showing slots), slot holding (reserve for 10 minutes while booking), database locking (transaction prevents concurrent bookings), optimistic locking (version check on booking creation). Display: available slots (green), held slots (yellow, &quot;X people viewing&quot;), booked slots (gray).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle time zones for bookings?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Store all times in business timezone (UTC or local). Detect customer timezone (browser), convert for display (show local times). Daylight saving: automatic adjustment (use timezone library). Display: &quot;All times shown in your local time (PST)&quot;, timezone selector (change if traveling). Booking confirmation: show both timezones (business time, customer time).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you reduce no-shows?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Reminders (24 hours email, 2 hours SMS), confirmation required (reply YES to confirm), deposit/prepayment (financial commitment), no-show fee (charge if don&apos;t show), overbooking (book 110% capacity, historical no-show rate). Analytics: track no-show rate by customer, time, day. High-risk customers: require deposit, send more reminders.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cancellations?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Cancellation policy: free until 24 hours ahead, 50% fee after, no refund for no-show. Self-service: &quot;Cancel Booking&quot; link, select reason (optional), confirmation (email). Refund: automatic (original payment method), processing time (3-5 days), store credit (instant). Analytics: track cancellation rate, reasons (improve service).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize staff utilization?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Any available (balance across staff), prefer staff (fallback to any), dynamic pricing (discount for less popular staff), show availability (highlight staff with more slots), booking rules (minimum/maximum per staff). Analytics: track utilization per staff (booked hours / available hours), identify underutilized (promote), overutilized (hire more).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle multi-slot bookings?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Sequential: select start time, auto-calculate end (service + buffer), hold all slots. Non-sequential: select multiple dates/times (consultation + service), hold all before confirm. Multi-day: select date range (check-in to check-out), calculate total price. Display: &quot;Total duration: 1.5 hours&quot;, &quot;3 nights, 4 days&quot;, price breakdown (per slot, total).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.opentable.com/how-it-works"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenTable — How Restaurant Reservations Work
            </a>
          </li>
          <li>
            <a
              href="https://www.zocdoc.com/about/how-it-works"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zocdoc — How Medical Appointment Booking Works
            </a>
          </li>
          <li>
            <a
              href="https://www.airbnb.com/help/article/2623"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Airbnb — Booking and Reservation Policies
            </a>
          </li>
          <li>
            <a
              href="https://www.mindbodyonline.com/business-software/online-scheduling"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mindbody — Fitness Class Scheduling
            </a>
          </li>
          <li>
            <a
              href="https://www.enterprise.com/en/help/faqs/reservations.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Enterprise — Car Rental Reservations FAQ
            </a>
          </li>
          <li>
            <a
              href="https://www.nielsen-norman-group/articles/appointment-booking-ux/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Appointment Booking UX Best Practices
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
