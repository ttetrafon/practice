import { domainRoot } from "./config.js";

export const routes = {
  '/page-one': {
    content: 'page-one',
    title: "Page 1",
    description: "This is page one!",
    path: "/page-one",
    pathType: "WebPage"
  },
  '/page-two': {
    content: "page-two",
    title: "Page 2",
    description: "This is page two!",
    path: "/page-two",
    pathType: "WebPage"
  },
  '/404': {
    content: "page-404",
    title: "404 - Page not found",
    description: "The page you request was not found!",
    path: "/404",
    pathType: "WebPage"
  }
}

export const aliases = {
  '/': '/page-one'
}
