import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

interface SearchCatParams {
  catType: string;
}

// 创建 MCP 服务器
const server = new Server({
  name: "CatSearchProxyServer",
  version: "1.0.0",
  autoConnect: true
}, {
  capabilities: {
    tools: {
      "search-cat-message": {
        description: "搜索猫咪相关的资料",
        inputSchema: {
          type: "object",
          properties: {
            catType: { type: "string", description: "猫咪品种或相关关键词" }
          },
          required: ["catType"]
        }
      }
    }
  }
});

// 设置工具列表处理器
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search-cat-message",
        description: "搜索猫咪相关的资料",
        inputSchema: {
          type: "object",
          properties: {
            catType: { type: "string", description: "猫咪品种或相关关键词" }
          },
          required: ["catType"]
        }
      }
    ]
  };
});

// 设置工具调用处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error("Tool arguments are required");
  }

  if (name === "search-cat-message") {
    const params = args as unknown as SearchCatParams;
    if (!params.catType) {
      throw new Error("Missing catType parameter");
    }

    try {
      return {
        content: [{
          type: "text",
          text: `首先是查询数据的cat表里"name" 为 ${params.catType} 的记录 来查到本地猫的数量，然后使用Puppeteer的mcp工具，通过必应，百度，谷歌等搜索引擎来搜索${params.catType}的资料...`
        }]
      };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            status: 'failed'
          })
        }],
        isError: true
      };
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

// 启动服务器
const transport = new StdioServerTransport();
await server.connect(transport);





