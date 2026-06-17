import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';

/**
 * Build the Apify Actor input from node parameters.
 * Only the real Actor inputs are sent; the Output / Fields parameters shape the
 * data we return, they are not part of the Actor input. Optional fields are only
 * sent when the user provides a value so the Actor keeps its own defaults.
 */
export function buildActorInput(
	context: IExecuteFunctions,
	itemIndex: number,
	defaultInput: Record<string, any>,
): Record<string, any> {
	const input: Record<string, any> = {
		...defaultInput,
		q: context.getNodeParameter('q', itemIndex),
		device: context.getNodeParameter('device', itemIndex),
		free_shipping: context.getNodeParameter('free_shipping', itemIndex),
		on_sale: context.getNodeParameter('on_sale', itemIndex),
		max_pages: context.getNodeParameter('max_pages', itemIndex),
	};

	const location = context.getNodeParameter('location', itemIndex, '') as string;
	const gl = context.getNodeParameter('gl', itemIndex, '') as string;
	const hl = context.getNodeParameter('hl', itemIndex, '') as string;
	const minPrice = context.getNodeParameter('min_price', itemIndex, 0) as number;
	const maxPrice = context.getNodeParameter('max_price', itemIndex, 0) as number;

	if (location) input.location = location;
	if (gl) input.gl = gl;
	if (hl) input.hl = hl;
	if (minPrice > 0) input.min_price = minPrice;
	if (maxPrice > 0) input.max_price = maxPrice;

	return input;
}

const resourceProperties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Product',
				value: 'product',
			},
		],
		default: 'product',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['product'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search products',
				description: 'Search products and return one item per shopping result',
			},
		],
		default: 'search',
	},
];

const actorProperties: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'q',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. wireless headphones',
		description: 'The product to search for',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
	{
		displayName: 'Location',
		name: 'location',
		type: 'string',
		default: '',
		placeholder: 'e.g. Austin, Texas, United States',
		description: 'Location to run the search from. Optional.',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
	{
		displayName: 'Country Code',
		name: 'gl',
		type: 'string',
		default: '',
		placeholder: 'e.g. us',
		description: 'Two-letter country code the search runs from',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
	{
		displayName: 'Language Code',
		name: 'hl',
		type: 'string',
		default: '',
		placeholder: 'e.g. en',
		description: 'Two-letter language code for the results',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
	{
		displayName: 'Device',
		name: 'device',
		type: 'options',
		options: [
			{ name: 'Desktop', value: 'desktop' },
			{ name: 'Mobile', value: 'mobile' },
			{ name: 'Tablet', value: 'tablet' },
		],
		default: 'desktop',
		description: 'Which device profile to emulate for the search',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
	{
		displayName: 'Minimum Price',
		name: 'min_price',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		description: 'Only return products at or above this price. Use 0 for no limit.',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
	{
		displayName: 'Maximum Price',
		name: 'max_price',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		description: 'Only return products at or below this price. Use 0 for no limit.',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
	{
		displayName: 'Free Shipping Only',
		name: 'free_shipping',
		type: 'boolean',
		default: false,
		description: 'Whether to only return products that offer free shipping',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
	{
		displayName: 'On Sale Only',
		name: 'on_sale',
		type: 'boolean',
		default: false,
		description: 'Whether to only return products currently on sale',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
	{
		displayName: 'Maximum Pages',
		name: 'max_pages',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1 },
		description: 'How many result pages to fetch',
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
	},
];

const outputProperties: INodeProperties[] = [
	{
		displayName: 'Output',
		name: 'output',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['product'], operation: ['search'] } },
		options: [
			{
				name: 'Raw',
				value: 'raw',
				description: 'Return every field the API produces for each product',
			},
			{
				name: 'Selected Fields',
				value: 'selected',
				description: 'Choose exactly which fields to return',
			},
			{
				name: 'Simplified',
				value: 'simplified',
				description: 'Return a compact set of the most useful product fields',
			},
		],
		default: 'simplified',
		description: 'How much data to return for each product',
	},
	{
		displayName: 'Fields to Include',
		name: 'fields',
		type: 'multiOptions',
		displayOptions: {
			show: { resource: ['product'], operation: ['search'], output: ['selected'] },
		},
		options: [
			{ name: 'Delivery', value: 'delivery' },
			{ name: 'Extracted Price', value: 'extracted_price' },
			{ name: 'Immersive Product Page Token', value: 'immersive_product_page_token' },
			{ name: 'Multiple Sources', value: 'multiple_sources' },
			{ name: 'Position', value: 'position' },
			{ name: 'Price', value: 'price' },
			{ name: 'Product ID', value: 'product_id' },
			{ name: 'Product Link', value: 'product_link' },
			{ name: 'Rating', value: 'rating' },
			{ name: 'Reviews', value: 'reviews' },
			{ name: 'Snippet', value: 'snippet' },
			{ name: 'Source', value: 'source' },
			{ name: 'Thumbnail', value: 'thumbnail' },
			{ name: 'Title', value: 'title' },
		],
		default: ['position', 'title', 'price', 'source'],
		description: 'Which fields to return when Output is set to Selected Fields',
	},
];

const authenticationProperties: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [
			{
				name: 'API Key',
				value: 'apifyApi',
			},
			{
				name: 'OAuth2',
				value: 'apifyOAuth2Api',
			},
		],
		default: 'apifyApi',
		description: 'Choose which authentication method to use',
	},
];

export const properties: INodeProperties[] = [
	...resourceProperties,
	...actorProperties,
	...outputProperties,
	...authenticationProperties,
];
