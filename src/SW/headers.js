function createHeaders(userHeaders) {
    let headers = new Headers();

    headers.set(
        "user-agent",
        userHeaders.get("user-agent"),
    );
    headers.set("connection", userHeaders.get("connection"));
    headers.set("Upgrade-Insecure-Requests", userHeaders.get("upgrade-insecure-requests"));
    headers.set(
        "Accept",
        userHeaders.get("Accept")
      );
    headers.set("Accept-Language", userHeaders.get("Accept-Language"));
    headers.set("Accept-Encoding", userHeaders.get("Accept-Encoding"));

    return headers;

}

export { createHeaders }