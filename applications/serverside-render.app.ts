import express from 'express';
import path from 'path';
import { WidgetConfiguration } from './models/WidgetConfiguration';
import { IPromptFactory, PromptFactory } from '../commands/prompt.factory';

// Bootstrapping
const prompt: IPromptFactory = new PromptFactory();

// App Start
let app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views", "pug"));

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
        res.render(element.viewName);
    });
});

const port = + (prompt.acceptArgument(portArgName).extract().find(x => x.argName == portArgName)?.value ?? 1998);

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});