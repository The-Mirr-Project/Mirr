import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import  express  from "express"

const app = express()


app.use("/baremux/", express.static(baremuxPath));
app.use("/epoxy/", express.static(epoxyPath));


app.use(express.static("dist"))
app.use(express.static("static"))

app.listen(8080)