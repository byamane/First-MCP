import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from "zod";

// Create MCP server instance
const server = new McpServer({
    name: 'Weather Data Fetcher',
    version: '1.0.0'
});

// A helper function to simulate fetching weather data
async function getWeatherByCity (city: string){
    if (city.toLowerCase() === 'new york') {
        return { temp: '22°C', forecast: 'Partly cloudy with a breeze' };
    }
    if (city.toLowerCase() === 'london') {
        return { temp: '16°C', forecast: 'Rainy and overcast' };
    }
    return { temp: null, error: 'Weather data not available for this city' };
}

// Define weather fetching tool
server.registerTool(
    'getWeatherByCityName',
    {
        title: 'Weather by City',
        description: 'Get weather data for New York or London',
        inputSchema: {
            city: z.string().describe('Name of the city to get weather for')
        },
        outputSchema: {
            temp: z.string(),
            forecast: z.string().optional(),
            error: z.string().optional()
        }
    },
    async ({ city }) => {
        const weatherData = await getWeatherByCity(city);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(weatherData)
                }
            ],
            structuredContent: weatherData
        };
    }
);

// Registering a static resource on the MCP server
server.registerResource(
    'cities',
    'weather://cities',
    {
        title: 'List of supported cities',
        description: 'Get a list of supported cities for weather queries',
        mimeType: 'text/plain'
    },
    async (uri) => ({
        contents: [
            {
                uri: uri.href,
                text: `Supported Cities:\n- London (UK)\n- New York (USA)`
            }
        ]
    })
);