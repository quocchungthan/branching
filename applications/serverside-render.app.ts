import express, { Request } from 'express';
import cors from 'cors';
import path from 'path';
import { WidgetConfiguration } from './models/WidgetConfiguration';
import { IPromptFactory, PromptFactory } from '../commands/prompt.factory';
import { IStorageClient } from './data/abstract.client';
import { FileStorage } from './data/filestorage.client';
import { Submission } from './models/Submission';
import { ParsedQs } from 'qs';

// Bootstrapping
const prompt: IPromptFactory = new PromptFactory();
const storage: IStorageClient = new FileStorage();

// App Start
let app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views", "pug"));
app.use(cors());

// TODO: To be set up automatically since this a pluggable design

const portArgName = 'port';
const widgetPrefix = "/widgets";
const widgetsConfiguration: WidgetConfiguration[] = [
    {
        identifier: "comments",
        viewName: "comments"
    },
    {
        identifier: "likes",
        viewName: "likes"
    },
];

widgetsConfiguration.forEach(element => {
    app.get(`${widgetPrefix}/${element.identifier}`, (req, res) => {
        storage.get(getTargetUrl(req)).then(data => {
            res.render(element.viewName, { numerOfLikes: data.length, isHit: data.some(x => x.originIPAddress === getIpAdress(req)) });
        });
    });

    app.post(`${widgetPrefix}/${element.identifier}`, (req, res) => {
        const submission: Submission = {
            targetUrl: getTargetUrl(req),
            originIPAddress: getIpAdress(req),
            timeStamps: new Date().toISOString()
        };

        storage.insert(submission)
            .then((newIdentifier) => {
                return storage.get(getTargetUrl(req));
            })
            .then(data => {
                res.redirect(`${widgetPrefix}/${element.identifier}`)
            });
    });
});

const getTargetUrl = (req: Request) => {
    return req.originalUrl;
}


function getIpAdress(req: Request<{}, any, any, ParsedQs, Record<string, any>>): string {
    console.debug(req.headers, req.ips, req.ip);
    let fromXRI = req.headers['X-Real-IP'];

    if (typeof(fromXRI) === 'object' && fromXRI) {
        fromXRI = fromXRI[0];
    }

    return fromXRI ?? req.ips[0] ?? req.ip;
}

const port = + (prompt.acceptArgument(portArgName).extract().find(x => x.argName == portArgName)?.value ?? 1998);

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
