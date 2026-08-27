# n8n-nodes-apivault-airbnb-revenue-analyzer

An [n8n](https://n8n.io) community node for **Airbnb Revenue, Occupancy & ROI Analyzer**, powered by the [`apivault_labs/airbnb-revenue-occupancy-roi-analyzer` Apify Actor](https://apify.com/apivault_labs/airbnb-revenue-occupancy-roi-analyzer).

Analyze Airbnb listings or discover market comparables, then estimate weekly, monthly and annual revenue, occupancy, ADR, RevPAR, NOI, cap rate, cash-on-cash ROI and opportunity ranking.

The node is a thin connector: collection, analysis, retries and billing run in the hosted Actor. It contains no private scraper implementation or embedded credentials.

## Installation

1. Open **Settings → Community Nodes** in your n8n instance.
2. Select **Install**.
3. Enter `n8n-nodes-apivault-airbnb-revenue-analyzer` and confirm.

## Credentials

Create an **Apify API** credential in n8n and paste your personal token from [Apify Console → Integrations](https://console.apify.com/account/integrations). The token is sent to Apify as a bearer credential and is never bundled with this package.

## Usage

Add **Airbnb Revenue, Occupancy & ROI Analyzer** to a workflow, fill the public Actor inputs below, and execute the node. Every Dataset result becomes one n8n item, so it can flow into Sheets, databases, CRMs, alerts or your own code. The node respects n8n's **Continue On Fail** behavior.

| Input | Type | Description |
|---|---|---|
| `mode` | `string` | Analyze supplied listing URLs or discover and rank comparable listings for a location. |
| `listingUrls` | `array` | Public Airbnb room links or numeric listing IDs. One analysis row is returned per successful listing. |
| `searchLocation` | `string` | City, neighborhood or destination used to discover public comparable listings in market mode. |
| `maxComparableListings` | `integer` | Number of discovered properties to analyze and rank in market mode. |
| `searchBedrooms` | `integer` | Optional minimum bedroom filter for market comparable discovery. Use 0 for any. |
| `searchGuests` | `integer` | Optional guest-count filter for market comparable discovery. Use 0 for Airbnb defaults. |
| `calendarMonths` | `integer` | Analyze 1–12 months of forward availability. Longer windows improve seasonality coverage. |
| `currency` | `string` | Three-letter currency requested for published Airbnb prices and used for your financial assumptions. |
| `nightlyRateOverride` | `number` | Optional ADR assumption. Set 0 to use published forward calendar prices. |
| `bookingShareOfBlockedPercent` | `number` | Blocked nights may also be owner blocks or maintenance. This assumption converts the public blocked-night rate into estimated occupancy. |
| `averageStayNights` | `number` | Average booked nights per reservation, used for cleaning revenue and cost modeling. |
| `cleaningFeeRevenuePerStay` | `number` | Cleaning fee revenue collected from the guest for each estimated reservation. |
| `cleaningCostPerStay` | `number` | Your cleaning expense for each estimated reservation. |
| `platformFeePercent` | `number` | Estimated booking-platform fee as a percentage of gross revenue. |
| `managementFeePercent` | `number` | Property-management cost as a percentage of gross revenue. |
| `maintenancePercent` | `number` | Maintenance and replacement reserve as a percentage of gross revenue. |
| `utilitiesMonthly` | `number` | Average monthly utilities paid by the property owner. |
| `insuranceAnnual` | `number` | Annual insurance cost for the property. |
| `propertyTaxAnnual` | `number` | Annual property-tax expense. |
| `hoaMonthly` | `number` | Monthly homeowners-association or building fee. |
| `mortgageMonthly` | `number` | Debt service is excluded from NOI and included in annual cash flow and cash-on-cash return. |
| `purchasePrice` | `number` | Required for cap rate and acquisition return metrics. Set 0 for operations-only analysis. |
| `downPaymentPercent` | `number` | Down payment as a percentage of purchase price, used to calculate cash invested. |
| `closingCosts` | `number` | One-time acquisition closing costs included in cash invested. |
| `furnishingCosts` | `number` | One-time furnishing and launch costs included in cash invested. |
| `emitProjectionRows` | `boolean` | Also emit each weekly and monthly projection as a separate uncharged Dataset row for CSV and spreadsheet workflows. |
| `previousSnapshots` | `array` | Optional prior property metrics used to calculate occupancy, ADR and annual-revenue changes and monitoring alerts. |
| `maxConcurrency` | `integer` | Parallel property analyses. The default balances speed and upstream reliability. |
| `proxyConfiguration` | `object` | Residential proxy is recommended for public Airbnb availability. |

## Pricing

The package is free. Actor runs are billed by Apify using the pricing shown on the [Actor page](https://apify.com/apivault_labs/airbnb-revenue-occupancy-roi-analyzer); platform usage may also apply.

## Resources

- [Actor and live input schema](https://apify.com/apivault_labs/airbnb-revenue-occupancy-roi-analyzer)
- [Source repository](https://github.com/apivault-labs/n8n-nodes-apivault-airbnb-revenue-analyzer)
- [n8n community-node documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT. The hosted Actor is a separate paid service governed by Apify terms.
