# n8n-nodes-google-shopping-api

An [n8n](https://n8n.io/) community node that searches Google Shopping and returns structured product listings: title, price, seller, rating, reviews, delivery, and product link. It is backed by the [Google Shopping API](https://apify.com/johnvc/google-shopping-api-google-shopping-products-prices-deals?fpr=9n7kx3) on [Apify](https://apify.com?fpr=9n7kx3) and bills per result, so there are no subscriptions and no minimums.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Output](#output) · [Example workflows](#example-workflows) · [Pricing](#pricing) · [Resources](#resources)

## What it does

Give the node a product query, and it returns one item per shopping result with the title, price, seller, rating, review count, delivery note, and product link. It also works as an **AI Agent tool**, so an agent can compare prices on demand.

- Search products by query, optionally scoped to a location
- Filter by minimum and maximum price, free shipping, and on-sale only
- Emulate desktop, mobile, or tablet
- Choose how much data to return per product: Simplified, Raw, or Selected Fields

## Installation

Follow the n8n [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/):

1. In n8n, open **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-google-shopping-api` as the npm package name.
4. Agree to the risks of using community nodes, then select **Install**.

After it installs, the **Google Shopping** node appears in the nodes panel.

> n8n Cloud only allows verified community nodes. Until this node is verified, install it on a self-hosted n8n instance.

## Credentials

You need a free [Apify account](https://apify.com?fpr=9n7kx3) and an API token.

1. Sign in to the [Apify Console](https://console.apify.com?fpr=9n7kx3).
2. Open **Settings > Integrations** and copy your **Personal API token**.
3. In n8n, create a new **Apify API** credential and paste the token.
4. Use the credential's **Test** button to confirm it works.

The node also supports **Apify OAuth2** if you prefer to connect that way.

## Operations

**Product > Search** returns products that match a query.

| Parameter | Description |
| --- | --- |
| Search Query | The product to search for. Required. |
| Location | Location to run the search from. Optional. |
| Country Code / Language Code | Localization, for example `us` and `en`. |
| Device | Desktop, Mobile, or Tablet. |
| Minimum Price / Maximum Price | Price bounds. `0` for no limit. |
| Free Shipping Only / On Sale Only | Result filters. |
| Maximum Pages | How many result pages to fetch. |
| Output | How much data to return: Simplified, Raw, or Selected Fields. |

## Output

Each product is returned as its own n8n item. The API returns more than ten fields per product, so the **Output** parameter lets you choose how much to return:

- **Simplified** (default): a compact object with `position`, `title`, `price`, `source`, `rating`, `reviews`, `delivery`, `productLink`, and `productId`. This mode is also used automatically when the node runs as an AI Agent tool, to keep responses small.
- **Raw**: every field the API returns for each product, using the original field names below.
- **Selected Fields**: pick exactly which fields to include.

### Fields (Raw and Selected Fields)

| Field | Type | Description |
| --- | --- | --- |
| `position` | integer | Rank of the result on the page |
| `title` | string | Product title |
| `product_id` | string | Google product identifier |
| `product_link` | string | Link to the product on Google Shopping |
| `immersive_product_page_token` | string | Token for the immersive product page |
| `source` | string | Seller or store name |
| `multiple_sources` | boolean | Whether the product is sold by multiple sellers |
| `price` | string | Displayed price |
| `extracted_price` | number | Numeric price |
| `rating` | number | Product rating |
| `reviews` | integer | Number of reviews |
| `snippet` | string | Short product description |
| `thumbnail` | string | Product image URL |
| `delivery` | string | Delivery or shipping note |

## Example workflows

### 1. Price comparison into a sheet

1. **Manual Trigger**.
2. **Google Shopping**: Search Query your product, Output `Simplified`.
3. **Sort**: by `price`; **Google Sheets**: append `title`, `price`, `source`, and `productLink`.

### 2. Daily deal watch

1. **Schedule Trigger**: run daily.
2. **Google Shopping**: your product, On Sale Only enabled, Maximum Price set to your target.
3. **Slack**: alert when matching deals appear.

### 3. Let an AI Agent compare prices

1. **AI Agent** node.
2. Attach **Google Shopping** as a tool.
3. Ask "What's the cheapest noise-cancelling headphone right now?" The agent calls the node (in Simplified mode) and answers with live listings.

## Pricing

This node calls the [Google Shopping API](https://apify.com/johnvc/google-shopping-api-google-shopping-products-prices-deals?fpr=9n7kx3) on Apify, which is billed **pay-per-result**: a small per-search fee (about **$0.04 per page** of results) plus a fraction of a cent per product returned, with no subscription and no minimums. Apify also includes a free monthly usage tier that covers typical volumes. See the [Actor page](https://apify.com/johnvc/google-shopping-api-google-shopping-products-prices-deals?fpr=9n7kx3) for current rates.

## Resources

- [Google Shopping API on Apify](https://apify.com/johnvc/google-shopping-api-google-shopping-products-prices-deals?fpr=9n7kx3)
- [npm package](https://www.npmjs.com/package/n8n-nodes-google-shopping-api)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Apify n8n integration guide](https://docs.apify.com/platform/integrations/n8n)

## License

[MIT](LICENSE.md)
