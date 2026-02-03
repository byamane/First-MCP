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
        inputSchema: z.object({
            city: z.string().describe('Name of the city to get weather for')
        }),
        async ({city})=> {
            const weatherData = await getWeatherByCity(city);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(weatherData)
                    }
                ]
            };
        }
    }
);

// Registering a static resource on the MCP server
server.registerResource(
    // URI: A unique identifier for this resource
    'weather://cities',
    // Description: Explains what this resource provides
    'List of supported cities',
    // MIME Type: Describe the format of the data being returned
    'text/plain',
    // Data Function: An async function that returns the actual content of the resource
    async()=> {
        return `Supported Cities:
        - London (UK)
        - New York (USA)`;
    }
);