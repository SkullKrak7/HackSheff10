# Known Issues

## ConversationAgent Occasionally Mentions Competitors

**Issue:** ConversationAgent may sometimes suggest non-Frasers retailers (JD Sports, ASOS, Zalando, etc.) despite system instructions to only recommend Frasers Group brands.

**Impact:** Low - RecommendationAgent (primary agent) correctly searches only Frasers sites

**Root Cause:** LLM training data includes knowledge of all retailers. System instructions and prompts don't always override this in conversational context.

**Workaround:** 
- RecommendationAgent uses Google Search grounding restricted to Frasers domains
- All product recommendations come from Frasers sites
- ConversationAgent is secondary (follow-up questions only)

**Status:** Documented, low priority

**Potential Fixes:**
1. Use fine-tuned model specifically for Frasers
2. Post-process ConversationAgent responses to filter competitor mentions
3. Use stricter prompt engineering with examples

---

## Grounding Links Sometimes Show as Redirects

**Issue:** Product links from Google Search grounding may appear as `vertexaisearch.cloud.google.com` redirects instead of direct Frasers URLs.

**Impact:** Low - Links still work and direct to correct products

**Root Cause:** Google's grounding API returns redirect URLs for tracking/analytics

**Workaround:** 
- Links are functional and lead to correct Frasers products
- Frasers brand buttons always show at bottom of recommendations

**Status:** Expected behavior from Google's API

---

## Image Generation Quota Limits

**Issue:** Gemini 3 Pro Image generation may hit rate limits during heavy usage

**Impact:** Medium - Image generation fails temporarily

**Root Cause:** API rate limits on free/paid tiers

**Workaround:**
- System gracefully handles failures
- Text recommendations still work
- Retry after rate limit window

**Status:** Expected API behavior

---

## Frontend Cache Issues

**Issue:** Browser may cache old JavaScript after updates

**Impact:** Low - Hard refresh resolves

**Workaround:** 
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Use incognito mode

**Status:** Standard web development issue

---

Last Updated: 2025-11-30
