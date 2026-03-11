import { ExposeStore } from "whatsapp-web.js/src/util/Injected/Store.js";
import { LoadUtils } from "whatsapp-web.js/src/util/Injected/Utils.js";
import "./whatsapp.ts";

LoadUtils();
ExposeStore();
