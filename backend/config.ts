const { env } = process

export default {

    // The port to listen on
    port: env.PORT || 5005,

    // The host to listen on
    host: env.HOST || "0.0.0.0"
}
