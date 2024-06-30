export const statusCode = {
    "1xx": {
        "100": "Continue",
        "101": "Switching Protocols",
        "102": "Processing",
        "103": "Early Hints"
    },
    "2xx": {
        "200": "OK",
        "201": "Created",
        "202": "Accepted",
        "204": "No Content",
        "206": "Partial Content"
    },
    "3xx": {
        "300": "Multiple Choices",
        "301": "Moved Permanently",
        "302": "Found (Moved Temporarily)",
        "304": "Not Modified",
        "307": "Temporary Redirect",
        "308": "Permanent Redirect"
    },
    "4xx": {
        "400": "Bad Request",
        "401": "Unauthorized",
        "403": "Forbidden",
        "404": "Not Found",
        "409": "Conflict",
        "410": "Gone",
        "429": "Too Many Requests"
    },
    "5xx": {
        "500": "Internal Server Error",
        "501": "Not Implemented",
        "502": "Bad Gateway",
        "503": "Service Unavailable",
        "504": "Gateway Timeout",
        "505": "HTTP Version Not Supported"
    }
}
