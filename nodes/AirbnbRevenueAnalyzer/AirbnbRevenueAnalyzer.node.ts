import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const ACTOR_ID = 'apivault_labs~airbnb-revenue-occupancy-roi-analyzer';

export class AirbnbRevenueAnalyzer implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Airbnb Revenue, Occupancy & ROI Analyzer',
		name: 'airbnbRevenueAnalyzer',
		icon: 'file:airbnbrevenueanalyzer.svg',
		group: ['transform'],
		version: 1,
		description: 'Analyze Airbnb listings or discover market comparables, then estimate weekly, monthly and annual revenue, occupancy, ADR, RevPAR, NOI, cap rate, cash-on-cash ROI and opportunity ranking.',
		defaults: { name: 'Airbnb Revenue, Occupancy & ROI Analyzer' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [{ name: 'apifyApi', required: true }],
		properties: [
   {
      "displayName": "Analysis mode",
      "name": "mode",
      "description": "Analyze supplied listing URLs or discover and rank comparable listings for a location.",
      "type": "options",
      "options": [
         {
            "name": "Listing URLs",
            "value": "listing"
         },
         {
            "name": "Market comparables",
            "value": "market"
         }
      ],
      "default": "listing"
   },
   {
      "displayName": "Airbnb listing URLs or room IDs",
      "name": "listingUrls",
      "description": "Public Airbnb room links or numeric listing IDs. One analysis row is returned per successful listing. (comma or new-line separated)",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Market location",
      "name": "searchLocation",
      "description": "City, neighborhood or destination used to discover public comparable listings in market mode.",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Maximum comparable listings",
      "name": "maxComparableListings",
      "description": "Number of discovered properties to analyze and rank in market mode.",
      "type": "number",
      "default": 10,
      "typeOptions": {
         "minValue": 3,
         "maxValue": 20
      }
   },
   {
      "displayName": "Minimum bedrooms",
      "name": "searchBedrooms",
      "description": "Optional minimum bedroom filter for market comparable discovery. Use 0 for any.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 20
      }
   },
   {
      "displayName": "Guests",
      "name": "searchGuests",
      "description": "Optional guest-count filter for market comparable discovery. Use 0 for Airbnb defaults.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 30
      }
   },
   {
      "displayName": "Forward calendar months",
      "name": "calendarMonths",
      "description": "Analyze 1–12 months of forward availability. Longer windows improve seasonality coverage.",
      "type": "number",
      "default": 6,
      "typeOptions": {
         "minValue": 1,
         "maxValue": 12
      }
   },
   {
      "displayName": "Currency",
      "name": "currency",
      "description": "Three-letter currency requested for published Airbnb prices and used for your financial assumptions.",
      "type": "string",
      "default": "USD"
   },
   {
      "displayName": "Nightly rate override",
      "name": "nightlyRateOverride",
      "description": "Optional ADR assumption. Set 0 to use published forward calendar prices.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Blocked nights that are bookings, %",
      "name": "bookingShareOfBlockedPercent",
      "description": "Blocked nights may also be owner blocks or maintenance. This assumption converts the public blocked-night rate into estimated occupancy.",
      "type": "number",
      "default": 75,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 100
      }
   },
   {
      "displayName": "Average stay length",
      "name": "averageStayNights",
      "description": "Average booked nights per reservation, used for cleaning revenue and cost modeling.",
      "type": "number",
      "default": 3,
      "typeOptions": {
         "minValue": 1,
         "maxValue": 365
      }
   },
   {
      "displayName": "Cleaning fee charged per stay",
      "name": "cleaningFeeRevenuePerStay",
      "description": "Cleaning fee revenue collected from the guest for each estimated reservation.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Cleaning cost per stay",
      "name": "cleaningCostPerStay",
      "description": "Your cleaning expense for each estimated reservation.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Platform fee, %",
      "name": "platformFeePercent",
      "description": "Estimated booking-platform fee as a percentage of gross revenue.",
      "type": "number",
      "default": 3,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 100
      }
   },
   {
      "displayName": "Property management, %",
      "name": "managementFeePercent",
      "description": "Property-management cost as a percentage of gross revenue.",
      "type": "number",
      "default": 15,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 100
      }
   },
   {
      "displayName": "Maintenance reserve, %",
      "name": "maintenancePercent",
      "description": "Maintenance and replacement reserve as a percentage of gross revenue.",
      "type": "number",
      "default": 5,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 100
      }
   },
   {
      "displayName": "Utilities per month",
      "name": "utilitiesMonthly",
      "description": "Average monthly utilities paid by the property owner.",
      "type": "number",
      "default": 300,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Insurance per year",
      "name": "insuranceAnnual",
      "description": "Annual insurance cost for the property.",
      "type": "number",
      "default": 1500,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Property tax per year",
      "name": "propertyTaxAnnual",
      "description": "Annual property-tax expense.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "HOA per month",
      "name": "hoaMonthly",
      "description": "Monthly homeowners-association or building fee.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Mortgage payment per month",
      "name": "mortgageMonthly",
      "description": "Debt service is excluded from NOI and included in annual cash flow and cash-on-cash return.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Purchase price",
      "name": "purchasePrice",
      "description": "Required for cap rate and acquisition return metrics. Set 0 for operations-only analysis.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Down payment, %",
      "name": "downPaymentPercent",
      "description": "Down payment as a percentage of purchase price, used to calculate cash invested.",
      "type": "number",
      "default": 20,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 100
      }
   },
   {
      "displayName": "Closing costs",
      "name": "closingCosts",
      "description": "One-time acquisition closing costs included in cash invested.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Furnishing and startup costs",
      "name": "furnishingCosts",
      "description": "One-time furnishing and launch costs included in cash invested.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Add CSV-friendly projection rows",
      "name": "emitProjectionRows",
      "description": "Also emit each weekly and monthly projection as a separate uncharged Dataset row for CSV and spreadsheet workflows.",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "Previous analysis snapshots",
      "name": "previousSnapshots",
      "description": "Optional prior property metrics used to calculate occupancy, ADR and annual-revenue changes and monitoring alerts.",
      "type": "json",
      "default": "[]"
   },
   {
      "displayName": "Processing concurrency",
      "name": "maxConcurrency",
      "description": "Parallel property analyses. The default balances speed and upstream reliability.",
      "type": "number",
      "default": 3,
      "typeOptions": {
         "minValue": 1,
         "maxValue": 8
      }
   },
   {
      "displayName": "Proxy configuration",
      "name": "proxyConfiguration",
      "description": "Residential proxy is recommended for public Airbnb availability.",
      "type": "json",
      "default": "{}"
   }
],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < items.length; i++) {
			try {
				const body: Record<string, unknown> = {};
				body["mode"] = this.getNodeParameter("mode", i);
				{ const _v = this.getNodeParameter("listingUrls", i, '') as string; const _a = _v.split(/[,\n]/).map(s=>s.trim()).filter(s=>s.length>0); if (_a.length) body["listingUrls"] = _a; }
				body["searchLocation"] = this.getNodeParameter("searchLocation", i);
				body["maxComparableListings"] = this.getNodeParameter("maxComparableListings", i);
				body["searchBedrooms"] = this.getNodeParameter("searchBedrooms", i);
				body["searchGuests"] = this.getNodeParameter("searchGuests", i);
				body["calendarMonths"] = this.getNodeParameter("calendarMonths", i);
				body["currency"] = this.getNodeParameter("currency", i);
				body["nightlyRateOverride"] = this.getNodeParameter("nightlyRateOverride", i);
				body["bookingShareOfBlockedPercent"] = this.getNodeParameter("bookingShareOfBlockedPercent", i);
				body["averageStayNights"] = this.getNodeParameter("averageStayNights", i);
				body["cleaningFeeRevenuePerStay"] = this.getNodeParameter("cleaningFeeRevenuePerStay", i);
				body["cleaningCostPerStay"] = this.getNodeParameter("cleaningCostPerStay", i);
				body["platformFeePercent"] = this.getNodeParameter("platformFeePercent", i);
				body["managementFeePercent"] = this.getNodeParameter("managementFeePercent", i);
				body["maintenancePercent"] = this.getNodeParameter("maintenancePercent", i);
				body["utilitiesMonthly"] = this.getNodeParameter("utilitiesMonthly", i);
				body["insuranceAnnual"] = this.getNodeParameter("insuranceAnnual", i);
				body["propertyTaxAnnual"] = this.getNodeParameter("propertyTaxAnnual", i);
				body["hoaMonthly"] = this.getNodeParameter("hoaMonthly", i);
				body["mortgageMonthly"] = this.getNodeParameter("mortgageMonthly", i);
				body["purchasePrice"] = this.getNodeParameter("purchasePrice", i);
				body["downPaymentPercent"] = this.getNodeParameter("downPaymentPercent", i);
				body["closingCosts"] = this.getNodeParameter("closingCosts", i);
				body["furnishingCosts"] = this.getNodeParameter("furnishingCosts", i);
				body["emitProjectionRows"] = this.getNodeParameter("emitProjectionRows", i);
				{ const _r = this.getNodeParameter("previousSnapshots", i, '') as string|object; if (_r) { try { body["previousSnapshots"] = typeof _r === 'string' ? JSON.parse(_r) : _r; } catch { throw new NodeOperationError(this.getNode(), "previousSnapshots" + ' must be valid JSON', { itemIndex: i }); } } }
				body["maxConcurrency"] = this.getNodeParameter("maxConcurrency", i);
				{ const _r = this.getNodeParameter("proxyConfiguration", i, '') as string|object; if (_r) { try { body["proxyConfiguration"] = typeof _r === 'string' ? JSON.parse(_r) : _r; } catch { throw new NodeOperationError(this.getNode(), "proxyConfiguration" + ' must be valid JSON', { itemIndex: i }); } } }
				const options: IRequestOptions = {
					method: 'POST' as IHttpRequestMethods,
					url: `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items`,
					body,
					json: true,
				};
				const response = await this.helpers.requestWithAuthentication.call(this, 'apifyApi', options);
				const results = Array.isArray(response) ? response : [response];
				for (const result of results) returnData.push({ json: result, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}
		return [returnData];
	}
}
