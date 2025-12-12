repository=$1
apiname=$2

echo "Downloading OpenAPI from $repository repository..."
#wget https://raw.githubusercontent.com/pagopa/$repository/main/openapi/openapi.json -O ./openapi/api-docs-$apiname.json
curl -L https://raw.githubusercontent.com/pagopa/$repository/main/openapi/openapi.json -o ./openapi/api-docs-$apiname.json

echo "Converting OpenAPI to Swagger..."
jq 'walk(if type == "object" and has("parameters") then .parameters |= map(select(.name != "X-Request-Id")) else . end)' ./openapi/api-docs-$apiname.json > ./openapi/api-docs-$apiname.json.temp
mv ./openapi/api-docs-${apiname}.json.temp ./openapi/api-docs-$apiname.json
mkdir -p openapi/generated/$apiname
api-spec-converter --from=openapi_3 --to=swagger_2 openapi/api-docs-$apiname.json > openapi/generated/$apiname/swagger20.json;

echo "Finalizing model generation..."
node openapi/scripts/api_fixPreGen.js $apiname;
gen-api-models --api-spec openapi/generated/$apiname/swagger20.json --out-dir src/api/generated/$apiname --no-strict --request-types --response-decoders --client;
node openapi/scripts/api_fixPostGen.js $apiname;