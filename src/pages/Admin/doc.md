# AI智能体管理系统API


**简介**:AI智能体管理系统API


**HOST**:http://localhost:8091/ai-agent-station


**联系人**:小傅哥


**Version**:1.0.0


**接口路径**:/ai-agent-station/v3/api-docs/default


[TOC]






# 客户端工具配置管理


## 新增客户端工具配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/tool/config/addClientToolConfig`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>添加新的客户端工具配置</p>



**请求示例**:


```javascript
{
  "id": 0,
  "clientId": 0,
  "toolType": "",
  "toolId": 0,
  "createTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiClientToolConfig|客户端工具配置信息|body|true|AiClientToolConfig|AiClientToolConfig|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;clientId|||false|integer(int64)||
|&emsp;&emsp;toolType|||false|string||
|&emsp;&emsp;toolId|||false|integer(int64)||
|&emsp;&emsp;createTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 删除客户端工具配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/tool/config/deleteClientToolConfig`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据ID删除客户端工具配置</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|客户端工具配置ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 根据客户端ID查询工具配置列表


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/tool/config/queryClientToolConfigByClientId`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据客户端ID查询对应的工具配置列表</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|clientId|客户端ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiClientToolConfig|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|clientId||integer(int64)|integer(int64)|
|toolType||string||
|toolId||integer(int64)|integer(int64)|
|createTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
[
	{
		"id": 0,
		"clientId": 0,
		"toolType": "",
		"toolId": 0,
		"createTime": ""
	}
]
```


## 根据ID查询客户端工具配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/tool/config/queryClientToolConfigById`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据配置ID查询客户端工具配置详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|客户端工具配置ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiClientToolConfig|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|clientId||integer(int64)|integer(int64)|
|toolType||string||
|toolId||integer(int64)|integer(int64)|
|createTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"id": 0,
	"clientId": 0,
	"toolType": "",
	"toolId": 0,
	"createTime": ""
}
```


## 查询客户端工具配置列表


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/tool/config/queryClientToolConfigList`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>分页查询客户端工具配置列表</p>



**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "orderBy": "",
  "id": 0,
  "clientId": 0,
  "toolName": "",
  "status": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|clientToolConfigQueryRequest|查询条件和分页参数|body|true|ClientToolConfigQueryRequest|ClientToolConfigQueryRequest|
|&emsp;&emsp;pageNum|页码，从1开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;orderBy|排序字段||false|string||
|&emsp;&emsp;id|配置ID||false|integer(int64)||
|&emsp;&emsp;clientId|客户端ID||false|integer(int64)||
|&emsp;&emsp;toolName|工具名称||false|string||
|&emsp;&emsp;status|状态||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|PageResponseAiClientToolConfig|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|pageNum|当前页码|integer(int32)|integer(int32)|
|pageSize|每页大小|integer(int32)|integer(int32)|
|total|总记录数|integer(int64)|integer(int64)|
|pages|总页数|integer(int32)|integer(int32)|
|list|数据列表|array|AiClientToolConfig|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;clientId||integer(int64)||
|&emsp;&emsp;toolType||string||
|&emsp;&emsp;toolId||integer(int64)||
|&emsp;&emsp;createTime||string(date-time)||
|hasNextPage|是否有下一页|boolean||
|hasPreviousPage|是否有上一页|boolean||


**响应示例**:
```javascript
{
	"pageNum": 0,
	"pageSize": 0,
	"total": 0,
	"pages": 0,
	"list": [
		{
			"id": 0,
			"clientId": 0,
			"toolType": "",
			"toolId": 0,
			"createTime": ""
		}
	],
	"hasNextPage": true,
	"hasPreviousPage": true
}
```


## 更新客户端工具配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/tool/config/updateClientToolConfig`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新现有客户端工具配置信息</p>



**请求示例**:


```javascript
{
  "id": 0,
  "clientId": 0,
  "toolType": "",
  "toolId": 0,
  "createTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiClientToolConfig|客户端工具配置信息|body|true|AiClientToolConfig|AiClientToolConfig|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;clientId|||false|integer(int64)||
|&emsp;&emsp;toolType|||false|string||
|&emsp;&emsp;toolId|||false|integer(int64)||
|&emsp;&emsp;createTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# 客户端顾问管理


## addClientAdvisor


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/advisor/addClientAdvisor`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0,
  "advisorId": "",
  "advisorName": "",
  "advisorType": "",
  "orderNum": 0,
  "extParam": "",
  "status": 0,
  "createTime": "",
  "updateTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiClientAdvisor|AiClientAdvisor|body|true|AiClientAdvisor|AiClientAdvisor|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;advisorId|||false|string||
|&emsp;&emsp;advisorName|||false|string||
|&emsp;&emsp;advisorType|||false|string||
|&emsp;&emsp;orderNum|||false|integer(int32)||
|&emsp;&emsp;extParam|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;updateTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## deleteClientAdvisor


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/advisor/deleteClientAdvisor`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## queryClientAdvisorById


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/advisor/queryClientAdvisorById`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiClientAdvisor|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|advisorId||string||
|advisorName||string||
|advisorType||string||
|orderNum||integer(int32)|integer(int32)|
|extParam||string||
|status||integer(int32)|integer(int32)|
|createTime||string(date-time)|string(date-time)|
|updateTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"id": 0,
	"advisorId": "",
	"advisorName": "",
	"advisorType": "",
	"orderNum": 0,
	"extParam": "",
	"status": 0,
	"createTime": "",
	"updateTime": ""
}
```


## 查询客户端顾问列表


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/advisor/queryClientAdvisorList`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>分页查询客户端顾问列表</p>



**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "orderBy": "",
  "id": 0,
  "status": "",
  "createTimeStart": "",
  "createTimeEnd": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|baseQueryRequest|查询条件|body|true|BaseQueryRequest|BaseQueryRequest|
|&emsp;&emsp;pageNum|页码，从1开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;orderBy|排序字段||false|string||
|&emsp;&emsp;id|ID||false|integer(int64)||
|&emsp;&emsp;status|状态||false|string||
|&emsp;&emsp;createTimeStart|创建时间开始||false|string||
|&emsp;&emsp;createTimeEnd|创建时间结束||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|PageResponseAiClientAdvisor|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|pageNum|当前页码|integer(int32)|integer(int32)|
|pageSize|每页大小|integer(int32)|integer(int32)|
|total|总记录数|integer(int64)|integer(int64)|
|pages|总页数|integer(int32)|integer(int32)|
|list|数据列表|array|AiClientAdvisor|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;advisorId||string||
|&emsp;&emsp;advisorName||string||
|&emsp;&emsp;advisorType||string||
|&emsp;&emsp;orderNum||integer(int32)||
|&emsp;&emsp;extParam||string||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|hasNextPage|是否有下一页|boolean||
|hasPreviousPage|是否有上一页|boolean||


**响应示例**:
```javascript
{
	"pageNum": 0,
	"pageSize": 0,
	"total": 0,
	"pages": 0,
	"list": [
		{
			"id": 0,
			"advisorId": "",
			"advisorName": "",
			"advisorType": "",
			"orderNum": 0,
			"extParam": "",
			"status": 0,
			"createTime": "",
			"updateTime": ""
		}
	],
	"hasNextPage": true,
	"hasPreviousPage": true
}
```


## updateClientAdvisor


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/advisor/updateClientAdvisor`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0,
  "advisorId": "",
  "advisorName": "",
  "advisorType": "",
  "orderNum": 0,
  "extParam": "",
  "status": 0,
  "createTime": "",
  "updateTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiClientAdvisor|AiClientAdvisor|body|true|AiClientAdvisor|AiClientAdvisor|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;advisorId|||false|string||
|&emsp;&emsp;advisorName|||false|string||
|&emsp;&emsp;advisorType|||false|string||
|&emsp;&emsp;orderNum|||false|integer(int32)||
|&emsp;&emsp;extParam|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;updateTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# 客户端顾问配置管理


## 新增客户端顾问配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/advisor/config/addClientAdvisorConfig`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>添加新的客户端顾问配置</p>



**请求示例**:


```javascript
{
  "id": 0,
  "clientId": 0,
  "advisorId": 0,
  "createTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiClientAdvisorConfig|客户端顾问配置信息|body|true|AiClientAdvisorConfig|AiClientAdvisorConfig|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;clientId|||false|integer(int64)||
|&emsp;&emsp;advisorId|||false|integer(int64)||
|&emsp;&emsp;createTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 删除客户端顾问配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/advisor/config/deleteClientAdvisorConfig`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据ID删除客户端顾问配置</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|客户端顾问配置ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 根据客户端ID查询顾问配置列表


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/advisor/config/queryClientAdvisorConfigByClientId`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据客户端ID查询对应的顾问配置列表</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|clientId|客户端ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiClientAdvisorConfig|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|clientId||integer(int64)|integer(int64)|
|advisorId||integer(int64)|integer(int64)|
|createTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
[
	{
		"id": 0,
		"clientId": 0,
		"advisorId": 0,
		"createTime": ""
	}
]
```


## 根据ID查询客户端顾问配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/advisor/config/queryClientAdvisorConfigById`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据配置ID查询客户端顾问配置详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|客户端顾问配置ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiClientAdvisorConfig|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|clientId||integer(int64)|integer(int64)|
|advisorId||integer(int64)|integer(int64)|
|createTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"id": 0,
	"clientId": 0,
	"advisorId": 0,
	"createTime": ""
}
```


## 查询客户端顾问配置列表


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/advisor/config/queryClientAdvisorConfigList`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>分页查询客户端顾问配置列表</p>



**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "orderBy": "",
  "id": 0,
  "clientId": 0,
  "advisorId": 0,
  "status": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|clientAdvisorConfigQueryRequest|查询条件和分页参数|body|true|ClientAdvisorConfigQueryRequest|ClientAdvisorConfigQueryRequest|
|&emsp;&emsp;pageNum|页码，从1开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;orderBy|排序字段||false|string||
|&emsp;&emsp;id|配置ID||false|integer(int64)||
|&emsp;&emsp;clientId|客户端ID||false|integer(int64)||
|&emsp;&emsp;advisorId|顾问ID||false|integer(int64)||
|&emsp;&emsp;status|状态||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|PageResponseAiClientAdvisorConfig|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|pageNum|当前页码|integer(int32)|integer(int32)|
|pageSize|每页大小|integer(int32)|integer(int32)|
|total|总记录数|integer(int64)|integer(int64)|
|pages|总页数|integer(int32)|integer(int32)|
|list|数据列表|array|AiClientAdvisorConfig|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;clientId||integer(int64)||
|&emsp;&emsp;advisorId||integer(int64)||
|&emsp;&emsp;createTime||string(date-time)||
|hasNextPage|是否有下一页|boolean||
|hasPreviousPage|是否有上一页|boolean||


**响应示例**:
```javascript
{
	"pageNum": 0,
	"pageSize": 0,
	"total": 0,
	"pages": 0,
	"list": [
		{
			"id": 0,
			"clientId": 0,
			"advisorId": 0,
			"createTime": ""
		}
	],
	"hasNextPage": true,
	"hasPreviousPage": true
}
```


## 更新客户端顾问配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/advisor/config/updateClientAdvisorConfig`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新现有客户端顾问配置信息</p>



**请求示例**:


```javascript
{
  "id": 0,
  "clientId": 0,
  "advisorId": 0,
  "createTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiClientAdvisorConfig|客户端顾问配置信息|body|true|AiClientAdvisorConfig|AiClientAdvisorConfig|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;clientId|||false|integer(int64)||
|&emsp;&emsp;advisorId|||false|integer(int64)||
|&emsp;&emsp;createTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# 客户端管理


## 新增客户端


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/addClient`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>新增客户端信息</p>



**请求示例**:


```javascript
{
  "id": 0,
  "agentId": 0,
  "clientId": 0,
  "sequence": 0,
  "createTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiAgentClient|AiAgentClient|body|true|AiAgentClient|AiAgentClient|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;agentId|||false|integer(int64)||
|&emsp;&emsp;clientId|||false|integer(int64)||
|&emsp;&emsp;sequence|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 删除客户端


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/deleteClient`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据ID删除客户端</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|客户端ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 根据智能体ID查询客户端


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/queryClientByAgentId`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据智能体ID查询关联的客户端列表</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|agentId|智能体ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiAgentClient|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|agentId||integer(int64)|integer(int64)|
|clientId||integer(int64)|integer(int64)|
|sequence||integer(int32)|integer(int32)|
|createTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
[
	{
		"id": 0,
		"agentId": 0,
		"clientId": 0,
		"sequence": 0,
		"createTime": ""
	}
]
```


## 根据ID查询客户端


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/queryClientById`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据客户端ID查询客户端详情</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|客户端ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiAgentClient|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|agentId||integer(int64)|integer(int64)|
|clientId||integer(int64)|integer(int64)|
|sequence||integer(int32)|integer(int32)|
|createTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"id": 0,
	"agentId": 0,
	"clientId": 0,
	"sequence": 0,
	"createTime": ""
}
```


## 查询客户端列表


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/queryClientList`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>分页查询客户端列表</p>



**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "orderBy": "",
  "id": 0,
  "agentId": 0,
  "clientName": "",
  "status": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|clientQueryRequest|客户端查询请求参数|body|true|ClientQueryRequest|ClientQueryRequest|
|&emsp;&emsp;pageNum|页码，从1开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;orderBy|排序字段||false|string||
|&emsp;&emsp;id|客户端ID||false|integer(int64)||
|&emsp;&emsp;agentId|智能体ID||false|integer(int64)||
|&emsp;&emsp;clientName|客户端名称||false|string||
|&emsp;&emsp;status|客户端状态||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|PageResponseAiAgentClient|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|pageNum|当前页码|integer(int32)|integer(int32)|
|pageSize|每页大小|integer(int32)|integer(int32)|
|total|总记录数|integer(int64)|integer(int64)|
|pages|总页数|integer(int32)|integer(int32)|
|list|数据列表|array|AiAgentClient|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;agentId||integer(int64)||
|&emsp;&emsp;clientId||integer(int64)||
|&emsp;&emsp;sequence||integer(int32)||
|&emsp;&emsp;createTime||string(date-time)||
|hasNextPage|是否有下一页|boolean||
|hasPreviousPage|是否有上一页|boolean||


**响应示例**:
```javascript
{
	"pageNum": 0,
	"pageSize": 0,
	"total": 0,
	"pages": 0,
	"list": [
		{
			"id": 0,
			"agentId": 0,
			"clientId": 0,
			"sequence": 0,
			"createTime": ""
		}
	],
	"hasNextPage": true,
	"hasPreviousPage": true
}
```


## 更新客户端


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/updateClient`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新客户端信息</p>



**请求示例**:


```javascript
{
  "id": 0,
  "agentId": 0,
  "clientId": 0,
  "sequence": 0,
  "createTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiAgentClient|AiAgentClient|body|true|AiAgentClient|AiAgentClient|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;agentId|||false|integer(int64)||
|&emsp;&emsp;clientId|||false|integer(int64)||
|&emsp;&emsp;sequence|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# 客户端模型管理


## 新增客户端模型


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/model/addClientModel`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>添加新的客户端模型</p>



**请求示例**:


```javascript
{
  "id": 0,
  "modelId": "",
  "apiId": "",
  "modelName": "",
  "modelType": "",
  "status": 0,
  "createTime": "",
  "updateTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiClientModel|客户端模型信息|body|true|AiClientModel|AiClientModel|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;modelId|||false|string||
|&emsp;&emsp;apiId|||false|string||
|&emsp;&emsp;modelName|||false|string||
|&emsp;&emsp;modelType|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;updateTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 删除客户端模型


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/model/deleteClientModel`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据ID删除客户端模型</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|客户端模型ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 查询所有模型配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/model/queryAllModelConfig`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有模型配置信息</p>



**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "orderBy": "",
  "id": 0,
  "status": "",
  "createTimeStart": "",
  "createTimeEnd": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|baseQueryRequest|查询条件|body|true|BaseQueryRequest|BaseQueryRequest|
|&emsp;&emsp;pageNum|页码，从1开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;orderBy|排序字段||false|string||
|&emsp;&emsp;id|ID||false|integer(int64)||
|&emsp;&emsp;status|状态||false|string||
|&emsp;&emsp;createTimeStart|创建时间开始||false|string||
|&emsp;&emsp;createTimeEnd|创建时间结束||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|PageResponseAiClientModelConfig|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|pageNum|当前页码|integer(int32)|integer(int32)|
|pageSize|每页大小|integer(int32)|integer(int32)|
|total|总记录数|integer(int64)|integer(int64)|
|pages|总页数|integer(int32)|integer(int32)|
|list|数据列表|array|AiClientModelConfig|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;clientId||integer(int64)||
|&emsp;&emsp;modelId||integer(int64)||
|&emsp;&emsp;createTime||string(date-time)||
|hasNextPage|是否有下一页|boolean||
|hasPreviousPage|是否有上一页|boolean||


**响应示例**:
```javascript
{
	"pageNum": 0,
	"pageSize": 0,
	"total": 0,
	"pages": 0,
	"list": [
		{
			"id": 0,
			"clientId": 0,
			"modelId": 0,
			"createTime": ""
		}
	],
	"hasNextPage": true,
	"hasPreviousPage": true
}
```


## 根据ID查询客户端模型


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/model/queryClientModelById`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据模型ID查询客户端模型详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|客户端模型ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiClientModelConfig|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|clientId||integer(int64)|integer(int64)|
|modelId||integer(int64)|integer(int64)|
|createTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"id": 0,
	"clientId": 0,
	"modelId": 0,
	"createTime": ""
}
```


## 查询客户端模型列表


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/model/queryClientModelList`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有客户端模型列表</p>



**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "orderBy": "",
  "id": 0,
  "status": "",
  "createTimeStart": "",
  "createTimeEnd": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|baseQueryRequest|查询条件|body|true|BaseQueryRequest|BaseQueryRequest|
|&emsp;&emsp;pageNum|页码，从1开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;orderBy|排序字段||false|string||
|&emsp;&emsp;id|ID||false|integer(int64)||
|&emsp;&emsp;status|状态||false|string||
|&emsp;&emsp;createTimeStart|创建时间开始||false|string||
|&emsp;&emsp;createTimeEnd|创建时间结束||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|PageResponseAiClientModel|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|pageNum|当前页码|integer(int32)|integer(int32)|
|pageSize|每页大小|integer(int32)|integer(int32)|
|total|总记录数|integer(int64)|integer(int64)|
|pages|总页数|integer(int32)|integer(int32)|
|list|数据列表|array|AiClientModel|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;modelId||string||
|&emsp;&emsp;apiId||string||
|&emsp;&emsp;modelName||string||
|&emsp;&emsp;modelType||string||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|hasNextPage|是否有下一页|boolean||
|hasPreviousPage|是否有上一页|boolean||


**响应示例**:
```javascript
{
	"pageNum": 0,
	"pageSize": 0,
	"total": 0,
	"pages": 0,
	"list": [
		{
			"id": 0,
			"modelId": "",
			"apiId": "",
			"modelName": "",
			"modelType": "",
			"status": 0,
			"createTime": "",
			"updateTime": ""
		}
	],
	"hasNextPage": true,
	"hasPreviousPage": true
}
```


## 更新客户端模型


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/model/updateClientModel`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新现有客户端模型信息</p>



**请求示例**:


```javascript
{
  "id": 0,
  "modelId": "",
  "apiId": "",
  "modelName": "",
  "modelType": "",
  "status": 0,
  "createTime": "",
  "updateTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiClientModel|客户端模型信息|body|true|AiClientModel|AiClientModel|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;modelId|||false|string||
|&emsp;&emsp;apiId|||false|string||
|&emsp;&emsp;modelName|||false|string||
|&emsp;&emsp;modelType|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;updateTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# 客户端模型配置管理


## 新增客户端模型配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/model/config/addClientModelConfig`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>添加新的客户端模型配置</p>



**请求示例**:


```javascript
{
  "id": 0,
  "clientId": 0,
  "modelId": 0,
  "createTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiClientModelConfig|客户端模型配置信息|body|true|AiClientModelConfig|AiClientModelConfig|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;clientId|||false|integer(int64)||
|&emsp;&emsp;modelId|||false|integer(int64)||
|&emsp;&emsp;createTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 删除客户端模型配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/model/config/deleteClientModelConfig`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据ID删除客户端模型配置</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|客户端模型配置ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 根据客户端ID查询模型配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/model/config/queryClientModelConfigByClientId`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据客户端ID查询对应的模型配置</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|clientId|客户端ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiClientModelConfig|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|clientId||integer(int64)|integer(int64)|
|modelId||integer(int64)|integer(int64)|
|createTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"id": 0,
	"clientId": 0,
	"modelId": 0,
	"createTime": ""
}
```


## 根据ID查询客户端模型配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/model/config/queryClientModelConfigById`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据配置ID查询客户端模型配置详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|客户端模型配置ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiClientModelConfig|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|clientId||integer(int64)|integer(int64)|
|modelId||integer(int64)|integer(int64)|
|createTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"id": 0,
	"clientId": 0,
	"modelId": 0,
	"createTime": ""
}
```


## 根据模型ID查询客户端模型配置列表


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/model/config/queryClientModelConfigByModelId`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据模型ID查询对应的客户端模型配置列表</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|modelId|模型ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiClientModelConfig|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|clientId||integer(int64)|integer(int64)|
|modelId||integer(int64)|integer(int64)|
|createTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
[
	{
		"id": 0,
		"clientId": 0,
		"modelId": 0,
		"createTime": ""
	}
]
```


## 查询客户端模型配置列表


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/model/config/queryClientModelConfigList`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>根据条件查询客户端模型配置列表</p>



**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "orderBy": "",
  "id": 0,
  "status": "",
  "createTimeStart": "",
  "createTimeEnd": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|baseQueryRequest|查询条件|body|true|BaseQueryRequest|BaseQueryRequest|
|&emsp;&emsp;pageNum|页码，从1开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;orderBy|排序字段||false|string||
|&emsp;&emsp;id|ID||false|integer(int64)||
|&emsp;&emsp;status|状态||false|string||
|&emsp;&emsp;createTimeStart|创建时间开始||false|string||
|&emsp;&emsp;createTimeEnd|创建时间结束||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|PageResponseAiClientModelConfig|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|pageNum|当前页码|integer(int32)|integer(int32)|
|pageSize|每页大小|integer(int32)|integer(int32)|
|total|总记录数|integer(int64)|integer(int64)|
|pages|总页数|integer(int32)|integer(int32)|
|list|数据列表|array|AiClientModelConfig|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;clientId||integer(int64)||
|&emsp;&emsp;modelId||integer(int64)||
|&emsp;&emsp;createTime||string(date-time)||
|hasNextPage|是否有下一页|boolean||
|hasPreviousPage|是否有上一页|boolean||


**响应示例**:
```javascript
{
	"pageNum": 0,
	"pageSize": 0,
	"total": 0,
	"pages": 0,
	"list": [
		{
			"id": 0,
			"clientId": 0,
			"modelId": 0,
			"createTime": ""
		}
	],
	"hasNextPage": true,
	"hasPreviousPage": true
}
```


## 更新客户端模型配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/model/config/updateClientModelConfig`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新现有客户端模型配置信息</p>



**请求示例**:


```javascript
{
  "id": 0,
  "clientId": 0,
  "modelId": 0,
  "createTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiClientModelConfig|客户端模型配置信息|body|true|AiClientModelConfig|AiClientModelConfig|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;clientId|||false|integer(int64)||
|&emsp;&emsp;modelId|||false|integer(int64)||
|&emsp;&emsp;createTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# 系统提示词管理


## 新增系统提示词


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/system/prompt/addSystemPrompt`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>添加新的系统提示词</p>



**请求示例**:


```javascript
{
  "id": 0,
  "promptId": "",
  "promptName": "",
  "promptContent": "",
  "description": "",
  "status": 0,
  "createTime": "",
  "updateTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiClientSystemPrompt|系统提示词信息|body|true|AiClientSystemPrompt|AiClientSystemPrompt|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;promptId|||false|string||
|&emsp;&emsp;promptName|||false|string||
|&emsp;&emsp;promptContent|||false|string||
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;updateTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 删除系统提示词


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/system/prompt/deleteSystemPrompt`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据ID删除系统提示词</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|系统提示词ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 查询所有系统提示词配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/system/prompt/queryAllSystemPromptConfig`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有系统提示词配置列表</p>



**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "orderBy": "",
  "id": 0,
  "status": "",
  "createTimeStart": "",
  "createTimeEnd": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|baseQueryRequest|查询条件|body|true|BaseQueryRequest|BaseQueryRequest|
|&emsp;&emsp;pageNum|页码，从1开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;orderBy|排序字段||false|string||
|&emsp;&emsp;id|ID||false|integer(int64)||
|&emsp;&emsp;status|状态||false|string||
|&emsp;&emsp;createTimeStart|创建时间开始||false|string||
|&emsp;&emsp;createTimeEnd|创建时间结束||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|PageResponseAiClientSystemPrompt|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|pageNum|当前页码|integer(int32)|integer(int32)|
|pageSize|每页大小|integer(int32)|integer(int32)|
|total|总记录数|integer(int64)|integer(int64)|
|pages|总页数|integer(int32)|integer(int32)|
|list|数据列表|array|AiClientSystemPrompt|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;promptId||string||
|&emsp;&emsp;promptName||string||
|&emsp;&emsp;promptContent||string||
|&emsp;&emsp;description||string||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|hasNextPage|是否有下一页|boolean||
|hasPreviousPage|是否有上一页|boolean||


**响应示例**:
```javascript
{
	"pageNum": 0,
	"pageSize": 0,
	"total": 0,
	"pages": 0,
	"list": [
		{
			"id": 0,
			"promptId": "",
			"promptName": "",
			"promptContent": "",
			"description": "",
			"status": 0,
			"createTime": "",
			"updateTime": ""
		}
	],
	"hasNextPage": true,
	"hasPreviousPage": true
}
```


## 根据ID查询系统提示词


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/system/prompt/querySystemPromptById`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据系统提示词ID查询详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|系统提示词ID|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiClientSystemPrompt|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|promptId||string||
|promptName||string||
|promptContent||string||
|description||string||
|status||integer(int32)|integer(int32)|
|createTime||string(date-time)|string(date-time)|
|updateTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"id": 0,
	"promptId": "",
	"promptName": "",
	"promptContent": "",
	"description": "",
	"status": 0,
	"createTime": "",
	"updateTime": ""
}
```


## 更新系统提示词


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/system/prompt/updateSystemPrompt`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新现有系统提示词信息</p>



**请求示例**:


```javascript
{
  "id": 0,
  "promptId": "",
  "promptName": "",
  "promptContent": "",
  "description": "",
  "status": 0,
  "createTime": "",
  "updateTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiClientSystemPrompt|系统提示词信息|body|true|AiClientSystemPrompt|AiClientSystemPrompt|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;promptId|||false|string||
|&emsp;&emsp;promptName|||false|string||
|&emsp;&emsp;promptContent|||false|string||
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;updateTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# 智能体客户端关联管理


## addAgentClient


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/client/addAgentClient`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0,
  "agentId": 0,
  "clientId": 0,
  "sequence": 0,
  "createTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiAgentClient|AiAgentClient|body|true|AiAgentClient|AiAgentClient|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;agentId|||false|integer(int64)||
|&emsp;&emsp;clientId|||false|integer(int64)||
|&emsp;&emsp;sequence|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## deleteAgentClient


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/client/deleteAgentClient`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## queryAgentClientByAgentId


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/client/queryAgentClientByAgentId`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|agentId||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiAgentClient|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|agentId||integer(int64)|integer(int64)|
|clientId||integer(int64)|integer(int64)|
|sequence||integer(int32)|integer(int32)|
|createTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
[
	{
		"id": 0,
		"agentId": 0,
		"clientId": 0,
		"sequence": 0,
		"createTime": ""
	}
]
```


## queryAgentClientByClientId


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/client/queryAgentClientByClientId`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|clientId||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiAgentClient|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|agentId||integer(int64)|integer(int64)|
|clientId||integer(int64)|integer(int64)|
|sequence||integer(int32)|integer(int32)|
|createTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
[
	{
		"id": 0,
		"agentId": 0,
		"clientId": 0,
		"sequence": 0,
		"createTime": ""
	}
]
```


## queryAgentClientById


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/client/queryAgentClientById`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiAgentClient|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|agentId||integer(int64)|integer(int64)|
|clientId||integer(int64)|integer(int64)|
|sequence||integer(int32)|integer(int32)|
|createTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"id": 0,
	"agentId": 0,
	"clientId": 0,
	"sequence": 0,
	"createTime": ""
}
```


## 查询智能体客户端关联列表


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/client/queryAgentClientList`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>分页查询AI智能体客户端关联列表</p>



**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "orderBy": "",
  "id": 0,
  "agentId": 0,
  "clientName": "",
  "status": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|clientQueryRequest|客户端查询请求参数|body|true|ClientQueryRequest|ClientQueryRequest|
|&emsp;&emsp;pageNum|页码，从1开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;orderBy|排序字段||false|string||
|&emsp;&emsp;id|客户端ID||false|integer(int64)||
|&emsp;&emsp;agentId|智能体ID||false|integer(int64)||
|&emsp;&emsp;clientName|客户端名称||false|string||
|&emsp;&emsp;status|客户端状态||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|PageResponseAiAgentClient|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|pageNum|当前页码|integer(int32)|integer(int32)|
|pageSize|每页大小|integer(int32)|integer(int32)|
|total|总记录数|integer(int64)|integer(int64)|
|pages|总页数|integer(int32)|integer(int32)|
|list|数据列表|array|AiAgentClient|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;agentId||integer(int64)||
|&emsp;&emsp;clientId||integer(int64)||
|&emsp;&emsp;sequence||integer(int32)||
|&emsp;&emsp;createTime||string(date-time)||
|hasNextPage|是否有下一页|boolean||
|hasPreviousPage|是否有上一页|boolean||


**响应示例**:
```javascript
{
	"pageNum": 0,
	"pageSize": 0,
	"total": 0,
	"pages": 0,
	"list": [
		{
			"id": 0,
			"agentId": 0,
			"clientId": 0,
			"sequence": 0,
			"createTime": ""
		}
	],
	"hasNextPage": true,
	"hasPreviousPage": true
}
```


## updateAgentClient


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/client/updateAgentClient`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0,
  "agentId": 0,
  "clientId": 0,
  "sequence": 0,
  "createTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiAgentClient|AiAgentClient|body|true|AiAgentClient|AiAgentClient|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;agentId|||false|integer(int64)||
|&emsp;&emsp;clientId|||false|integer(int64)||
|&emsp;&emsp;sequence|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# AI代理任务调度管理


## 新增AI代理任务调度


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/task/addTaskSchedule`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>添加新的AI代理任务调度</p>



**请求示例**:


```javascript
{
  "id": 0,
  "agentId": 0,
  "taskName": "",
  "description": "",
  "cronExpression": "",
  "taskParam": "",
  "status": 0,
  "createTime": "",
  "updateTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiAgentTaskSchedule|AI代理任务调度信息|body|true|AiAgentTaskSchedule|AiAgentTaskSchedule|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;agentId|||false|integer(int64)||
|&emsp;&emsp;taskName|||false|string||
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;cronExpression|||false|string||
|&emsp;&emsp;taskParam|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;updateTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 删除AI代理任务调度


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/task/deleteTaskSchedule`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据ID删除AI代理任务调度</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|AI代理任务调度ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 根据ID查询AI代理任务调度


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/task/queryTaskScheduleById`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据任务调度ID查询详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|AI代理任务调度ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiAgentTaskSchedule|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|agentId||integer(int64)|integer(int64)|
|taskName||string||
|description||string||
|cronExpression||string||
|taskParam||string||
|status||integer(int32)|integer(int32)|
|createTime||string(date-time)|string(date-time)|
|updateTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"id": 0,
	"agentId": 0,
	"taskName": "",
	"description": "",
	"cronExpression": "",
	"taskParam": "",
	"status": 0,
	"createTime": "",
	"updateTime": ""
}
```


## 查询AI代理任务调度列表


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/task/queryTaskScheduleList`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有AI代理任务调度列表</p>



**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "orderBy": "",
  "id": 0,
  "status": "",
  "createTimeStart": "",
  "createTimeEnd": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|baseQueryRequest|查询条件|body|true|BaseQueryRequest|BaseQueryRequest|
|&emsp;&emsp;pageNum|页码，从1开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;orderBy|排序字段||false|string||
|&emsp;&emsp;id|ID||false|integer(int64)||
|&emsp;&emsp;status|状态||false|string||
|&emsp;&emsp;createTimeStart|创建时间开始||false|string||
|&emsp;&emsp;createTimeEnd|创建时间结束||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|PageResponseAiAgentTaskSchedule|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|pageNum|当前页码|integer(int32)|integer(int32)|
|pageSize|每页大小|integer(int32)|integer(int32)|
|total|总记录数|integer(int64)|integer(int64)|
|pages|总页数|integer(int32)|integer(int32)|
|list|数据列表|array|AiAgentTaskSchedule|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;agentId||integer(int64)||
|&emsp;&emsp;taskName||string||
|&emsp;&emsp;description||string||
|&emsp;&emsp;cronExpression||string||
|&emsp;&emsp;taskParam||string||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|hasNextPage|是否有下一页|boolean||
|hasPreviousPage|是否有上一页|boolean||


**响应示例**:
```javascript
{
	"pageNum": 0,
	"pageSize": 0,
	"total": 0,
	"pages": 0,
	"list": [
		{
			"id": 0,
			"agentId": 0,
			"taskName": "",
			"description": "",
			"cronExpression": "",
			"taskParam": "",
			"status": 0,
			"createTime": "",
			"updateTime": ""
		}
	],
	"hasNextPage": true,
	"hasPreviousPage": true
}
```


## 更新AI代理任务调度


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/task/updateTaskSchedule`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新现有AI代理任务调度信息</p>



**请求示例**:


```javascript
{
  "id": 0,
  "agentId": 0,
  "taskName": "",
  "description": "",
  "cronExpression": "",
  "taskParam": "",
  "status": 0,
  "createTime": "",
  "updateTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiAgentTaskSchedule|AI代理任务调度信息|body|true|AiAgentTaskSchedule|AiAgentTaskSchedule|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;agentId|||false|integer(int64)||
|&emsp;&emsp;taskName|||false|string||
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;cronExpression|||false|string||
|&emsp;&emsp;taskParam|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;updateTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# AI智能体管理


## 新增AI智能体


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/addAiAgent`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>创建新的AI智能体</p>



**请求示例**:


```javascript
{
  "id": 0,
  "agentId": "",
  "agentName": "",
  "description": "",
  "channel": "",
  "status": 0,
  "createTime": "",
  "updateTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiAgent|智能体信息|body|true|AiAgent|AiAgent|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;agentId|||false|string||
|&emsp;&emsp;agentName|||false|string||
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;channel|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;updateTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 删除AI智能体


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/deleteAiAgent`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据ID删除AI智能体</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|智能体ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 根据ID查询AI智能体


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/queryAiAgentById`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据智能体ID获取详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|智能体ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiAgent|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|agentId||string||
|agentName||string||
|description||string||
|channel||string||
|status||integer(int32)|integer(int32)|
|createTime||string(date-time)|string(date-time)|
|updateTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"id": 0,
	"agentId": "",
	"agentName": "",
	"description": "",
	"channel": "",
	"status": 0,
	"createTime": "",
	"updateTime": ""
}
```


## 查询AI智能体列表


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/queryAiAgentList`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>分页查询AI智能体列表</p>



**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "orderBy": "",
  "id": 0,
  "status": "",
  "createTimeStart": "",
  "createTimeEnd": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|baseQueryRequest|查询条件|body|true|BaseQueryRequest|BaseQueryRequest|
|&emsp;&emsp;pageNum|页码，从1开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;orderBy|排序字段||false|string||
|&emsp;&emsp;id|ID||false|integer(int64)||
|&emsp;&emsp;status|状态||false|string||
|&emsp;&emsp;createTimeStart|创建时间开始||false|string||
|&emsp;&emsp;createTimeEnd|创建时间结束||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|PageResponseAiAgent|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|pageNum|当前页码|integer(int32)|integer(int32)|
|pageSize|每页大小|integer(int32)|integer(int32)|
|total|总记录数|integer(int64)|integer(int64)|
|pages|总页数|integer(int32)|integer(int32)|
|list|数据列表|array|AiAgent|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;agentId||string||
|&emsp;&emsp;agentName||string||
|&emsp;&emsp;description||string||
|&emsp;&emsp;channel||string||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|hasNextPage|是否有下一页|boolean||
|hasPreviousPage|是否有上一页|boolean||


**响应示例**:
```javascript
{
	"pageNum": 0,
	"pageSize": 0,
	"total": 0,
	"pages": 0,
	"list": [
		{
			"id": 0,
			"agentId": "",
			"agentName": "",
			"description": "",
			"channel": "",
			"status": 0,
			"createTime": "",
			"updateTime": ""
		}
	],
	"hasNextPage": true,
	"hasPreviousPage": true
}
```


## 根据渠道查询智能体配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/queryAllAgentConfigListByChannel`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据指定渠道获取智能体配置列表</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|channel|渠道名称|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiAgent|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|agentId||string||
|agentName||string||
|description||string||
|channel||string||
|status||integer(int32)|integer(int32)|
|createTime||string(date-time)|string(date-time)|
|updateTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
[
	{
		"id": 0,
		"agentId": "",
		"agentName": "",
		"description": "",
		"channel": "",
		"status": 0,
		"createTime": "",
		"updateTime": ""
	}
]
```


## 更新AI智能体


**接口地址**:`/ai-agent-station/api/v1/ai/admin/agent/updateAiAgent`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新现有AI智能体信息</p>



**请求示例**:


```javascript
{
  "id": 0,
  "agentId": "",
  "agentName": "",
  "description": "",
  "channel": "",
  "status": 0,
  "createTime": "",
  "updateTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiAgent|智能体信息|body|true|AiAgent|AiAgent|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;agentId|||false|string||
|&emsp;&emsp;agentName|||false|string||
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;channel|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;updateTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# MCP工具管理


## 新增MCP配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/tool/mcp/addMcp`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>添加新的MCP配置</p>



**请求示例**:


```javascript
{
  "id": 0,
  "mcpId": "",
  "mcpName": "",
  "transportType": "",
  "transportConfig": "",
  "requestTimeout": 0,
  "status": 0,
  "createTime": "",
  "updateTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiClientToolMcp|MCP配置信息|body|true|AiClientToolMcp|AiClientToolMcp|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;mcpId|||false|string||
|&emsp;&emsp;mcpName|||false|string||
|&emsp;&emsp;transportType|||false|string||
|&emsp;&emsp;transportConfig|||false|string||
|&emsp;&emsp;requestTimeout|||false|integer(int32)||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;updateTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 删除MCP配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/tool/mcp/deleteMcp`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据ID删除MCP配置</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|MCP配置ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 根据ID查询MCP配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/tool/mcp/queryMcpById`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据MCP配置ID查询详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|MCP配置ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiClientToolMcp|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|mcpId||string||
|mcpName||string||
|transportType||string||
|transportConfig||string||
|requestTimeout||integer(int32)|integer(int32)|
|status||integer(int32)|integer(int32)|
|createTime||string(date-time)|string(date-time)|
|updateTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"id": 0,
	"mcpId": "",
	"mcpName": "",
	"transportType": "",
	"transportConfig": "",
	"requestTimeout": 0,
	"status": 0,
	"createTime": "",
	"updateTime": ""
}
```


## 查询MCP配置列表


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/tool/mcp/queryMcpList`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有MCP配置列表</p>



**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "orderBy": "",
  "id": 0,
  "status": "",
  "createTimeStart": "",
  "createTimeEnd": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|baseQueryRequest|查询条件|body|true|BaseQueryRequest|BaseQueryRequest|
|&emsp;&emsp;pageNum|页码，从1开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;orderBy|排序字段||false|string||
|&emsp;&emsp;id|ID||false|integer(int64)||
|&emsp;&emsp;status|状态||false|string||
|&emsp;&emsp;createTimeStart|创建时间开始||false|string||
|&emsp;&emsp;createTimeEnd|创建时间结束||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|PageResponseAiClientToolMcp|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|pageNum|当前页码|integer(int32)|integer(int32)|
|pageSize|每页大小|integer(int32)|integer(int32)|
|total|总记录数|integer(int64)|integer(int64)|
|pages|总页数|integer(int32)|integer(int32)|
|list|数据列表|array|AiClientToolMcp|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;mcpId||string||
|&emsp;&emsp;mcpName||string||
|&emsp;&emsp;transportType||string||
|&emsp;&emsp;transportConfig||string||
|&emsp;&emsp;requestTimeout||integer(int32)||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|hasNextPage|是否有下一页|boolean||
|hasPreviousPage|是否有上一页|boolean||


**响应示例**:
```javascript
{
	"pageNum": 0,
	"pageSize": 0,
	"total": 0,
	"pages": 0,
	"list": [
		{
			"id": 0,
			"mcpId": "",
			"mcpName": "",
			"transportType": "",
			"transportConfig": "",
			"requestTimeout": 0,
			"status": 0,
			"createTime": "",
			"updateTime": ""
		}
	],
	"hasNextPage": true,
	"hasPreviousPage": true
}
```


## 更新MCP配置


**接口地址**:`/ai-agent-station/api/v1/ai/admin/client/tool/mcp/updateMcp`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新现有MCP配置信息</p>



**请求示例**:


```javascript
{
  "id": 0,
  "mcpId": "",
  "mcpName": "",
  "transportType": "",
  "transportConfig": "",
  "requestTimeout": 0,
  "status": 0,
  "createTime": "",
  "updateTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiClientToolMcp|MCP配置信息|body|true|AiClientToolMcp|AiClientToolMcp|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;mcpId|||false|string||
|&emsp;&emsp;mcpName|||false|string||
|&emsp;&emsp;transportType|||false|string||
|&emsp;&emsp;transportConfig|||false|string||
|&emsp;&emsp;requestTimeout|||false|integer(int32)||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;updateTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# RAG顺序管理


## 新增RAG顺序


**接口地址**:`/ai-agent-station/api/v1/ai/admin/rag/addRagOrder`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>添加新的RAG顺序</p>



**请求示例**:


```javascript
{
  "id": 0,
  "ragName": "",
  "knowledgeTag": "",
  "status": 0,
  "createTime": "",
  "updateTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiRagOrder|RAG顺序信息|body|true|AiRagOrder|AiRagOrder|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;ragName|||false|string||
|&emsp;&emsp;knowledgeTag|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;updateTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 删除RAG顺序


**接口地址**:`/ai-agent-station/api/v1/ai/admin/rag/deleteRagOrder`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据ID删除RAG顺序</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|RAG顺序ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## 查询所有有效RAG顺序


**接口地址**:`/ai-agent-station/api/v1/ai/admin/rag/queryAllValidRagOrder`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有有效的RAG顺序列表</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiRagOrder|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|ragName||string||
|knowledgeTag||string||
|status||integer(int32)|integer(int32)|
|createTime||string(date-time)|string(date-time)|
|updateTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
[
	{
		"id": 0,
		"ragName": "",
		"knowledgeTag": "",
		"status": 0,
		"createTime": "",
		"updateTime": ""
	}
]
```


## 根据ID查询RAG顺序


**接口地址**:`/ai-agent-station/api/v1/ai/admin/rag/queryRagOrderById`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据RAG顺序ID查询详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|RAG顺序ID|query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|AiRagOrder|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id||integer(int64)|integer(int64)|
|ragName||string||
|knowledgeTag||string||
|status||integer(int32)|integer(int32)|
|createTime||string(date-time)|string(date-time)|
|updateTime||string(date-time)|string(date-time)|


**响应示例**:
```javascript
{
	"id": 0,
	"ragName": "",
	"knowledgeTag": "",
	"status": 0,
	"createTime": "",
	"updateTime": ""
}
```


## 查询RAG顺序列表


**接口地址**:`/ai-agent-station/api/v1/ai/admin/rag/queryRagOrderList`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>分页查询RAG顺序列表</p>



**请求示例**:


```javascript
{
  "pageNum": 1,
  "pageSize": 10,
  "orderBy": "",
  "id": 0,
  "clientId": 0,
  "ragName": "",
  "status": "",
  "sort": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|ragOrderQueryRequest|查询条件和分页参数|body|true|RagOrderQueryRequest|RagOrderQueryRequest|
|&emsp;&emsp;pageNum|页码，从1开始||false|integer(int32)||
|&emsp;&emsp;pageSize|每页大小||false|integer(int32)||
|&emsp;&emsp;orderBy|排序字段||false|string||
|&emsp;&emsp;id|RAG顺序ID||false|integer(int64)||
|&emsp;&emsp;clientId|客户端ID||false|integer(int64)||
|&emsp;&emsp;ragName|RAG名称||false|string||
|&emsp;&emsp;status|状态||false|string||
|&emsp;&emsp;sort|排序||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|PageResponseAiRagOrder|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|pageNum|当前页码|integer(int32)|integer(int32)|
|pageSize|每页大小|integer(int32)|integer(int32)|
|total|总记录数|integer(int64)|integer(int64)|
|pages|总页数|integer(int32)|integer(int32)|
|list|数据列表|array|AiRagOrder|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;ragName||string||
|&emsp;&emsp;knowledgeTag||string||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|hasNextPage|是否有下一页|boolean||
|hasPreviousPage|是否有上一页|boolean||


**响应示例**:
```javascript
{
	"pageNum": 0,
	"pageSize": 0,
	"total": 0,
	"pages": 0,
	"list": [
		{
			"id": 0,
			"ragName": "",
			"knowledgeTag": "",
			"status": 0,
			"createTime": "",
			"updateTime": ""
		}
	],
	"hasNextPage": true,
	"hasPreviousPage": true
}
```


## 更新RAG顺序


**接口地址**:`/ai-agent-station/api/v1/ai/admin/rag/updateRagOrder`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新现有RAG顺序信息</p>



**请求示例**:


```javascript
{
  "id": 0,
  "ragName": "",
  "knowledgeTag": "",
  "status": 0,
  "createTime": "",
  "updateTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|aiRagOrder|RAG顺序信息|body|true|AiRagOrder|AiRagOrder|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;ragName|||false|string||
|&emsp;&emsp;knowledgeTag|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;updateTime|||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```