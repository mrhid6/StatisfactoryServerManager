const axios = require('axios').default;
const Config = require("./server_config");

class AgentAPI {

    constructor() {}


    remoteRequestGET(Agent, endpoint) {
        return new Promise((resolve, reject) => {

            const reqconfig = {
                headers: {
                    "x-ssm-key": Config.get("ssm.agent.publickey")
                }
            }
            const url = Agent.getURL() + endpoint;
            //console.log(url)

            axios.get(url, reqconfig).then(res => {
                const data = res.data;

                if (data.result != "success") {
                    reject(new Error("Request returned an error: " + data.error));
                } else {
                    resolve(res);
                }
            }).catch(err => {
                reject(err);
            })
        });
    }
    remoteRequestPOST(Agent, endpoint, requestdata) {
        return new Promise((resolve, reject) => {

            const reqconfig = {
                headers: {
                    "x-ssm-key": Config.get("ssm.agent.publickey")
                }
            }

            const url = Agent.getURL() + endpoint;
            //console.log(url)

            axios.post(url, requestdata, reqconfig).then(res => {
                const data = res.data;

                if (data.result != "success") {
                    reject(new Error("Request returned an error: " + data.error));
                } else {
                    resolve(res);
                }
            }).catch(err => {
                reject(err);
            })
        });
    }

    InitNewAgent(Agent) {
        return new Promise((resolve, reject) => {
            const postData = {
                publicKey: Config.get("ssm.agent.publickey"),
                agentId: Agent.getId()
            }
            this.remoteRequestPOST(Agent, "init", postData).then(res => {

                resolve();
            }).catch(err => {
                reject();
            })
        });
    }

    PingAgent(Agent) {
        return new Promise((resolve, reject) => {

            if (Agent.isRunning() === false) {
                resolve(false);
                return;
            }

            this.remoteRequestGET(Agent, "ping").then(res => {
                if (res.data.result == "success") {
                    resolve(true);
                }
            }).catch(() => {
                resolve(false);
            })
        })
    }

}

const agentApi = new AgentAPI();
module.exports = agentApi;