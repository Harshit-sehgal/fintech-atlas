# Goal 03 — AI Financial Assistant

**Status:** 🔴 Requires model service + API · **Blocker:** no server or AI integration

**Objective:** A natural-language financial assistant.

## Requirements
- [ ] Natural language Q&A
- [ ] Calculator tool integration
- [ ] Structured responses
- [ ] Conversation history
- [ ] Source attribution where applicable
- [ ] Refusal for unsupported or unsafe financial guidance

## Definition of Done
- [ ] Answers are grounded in available data when appropriate.
- [ ] Calculator results are correct.
- [ ] Hallucination rate is monitored and within the target quality threshold.
- [ ] Latency meets the target (e.g. median response under 3s for supported tasks).
- [ ] User feedback system is operational.

## Status vs. this codebase
- None today. Requires an external model API, key management, a serverless
  function for safe key handling, conversation persistence, and a safety/refusal
  layer. Producing an ADR is a prerequisite.
