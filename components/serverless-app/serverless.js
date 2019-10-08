const path = require("path");
const { Component } = require("@serverless/core");
const { trackComponent } = require("@webiny/tracking");

const component = "@webiny/serverless-app";

class ServerlessApp extends Component {
    async default({ track, ...inputs } = {}) {
        await trackComponent({ track, context: this.context, component: __dirname });

        if (!inputs.code) {
            inputs.code = path.join(inputs.root, "build");
        }

        if (!inputs.handler) {
            inputs.handler = "handler.handler";
        }

        const fn = await this.load("@webiny/serverless-function");

        return await fn({ ...inputs, track: false });
    }

    async remove({ track, ...inputs } = {}) {
        await trackComponent({
            track,
            context: this.context,
            component: __dirname,
            method: "remove"
        });

        const fn = await this.load("@webiny/serverless-function");
        await fn.remove({ ...inputs, track: false });

        this.state = {};
        await this.save();
    }
}

module.exports = ServerlessApp;
