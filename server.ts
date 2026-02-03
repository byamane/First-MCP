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

// Define package tracking tool
server.registerTool(
    'trackPackage',
    {
        title: 'Package Tracker',
        description: 'Track delivery status using tracking number',
        inputSchema: z.object({
            trackingNumber: z.string().describe('Package tracking number'),
        }),
        async ({trackingNumber}) => {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Checking delivery status for: ${trackingNumber}`
                    }
                ]
            };
        }
    }
);

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