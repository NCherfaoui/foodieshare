[**FoodieShare API Documentation v1.0.0**](../README.md) • **Docs**

***

[FoodieShare API Documentation v1.0.0](../globals.md) / default

# Function: default()

## default(req, res)

> **default**(`req`, `res`): `any`

Express instance itself is a request handler, which could be invoked without
third argument.

### Parameters

• **req**: `IncomingMessage` \| `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\>

• **res**: `ServerResponse`\<`IncomingMessage`\> \| `Response`\<`any`, `Record`\<`string`, `any`\>, `number`\>

### Returns

`any`

### Defined in

[src/index.ts:25](https://github.com/CDA29/foodie-share-recipe-haven/blob/8e4f95f432ce3b831bdcb1262370443dd243c08d/backend/src/index.ts#L25)

## default(req, res, next)

> **default**(`req`, `res`, `next`): `void`

### Parameters

• **req**: `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\>

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>, `number`\>

• **next**: `NextFunction`

### Returns

`void`

### Defined in

[src/index.ts:25](https://github.com/CDA29/foodie-share-recipe-haven/blob/8e4f95f432ce3b831bdcb1262370443dd243c08d/backend/src/index.ts#L25)
