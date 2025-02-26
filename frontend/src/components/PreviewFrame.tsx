import { WebContainer } from "@webcontainer/api"
import { useEffect, useState } from "react"


interface PreviewFrameProps {
    files : any[],
    webContainer? : WebContainer
};


export const PreviewFrame = ({files , webContainer} : PreviewFrameProps) => {

    const[url , setUrl] = useState("");

    async function main() {
        
        if (!webContainer) {
            console.error("WebContainer is not initialized.");
            return;
        }

        const installProcess = await webContainer.spawn('npm', ['install']);
    
        installProcess.output.pipeTo(new WritableStream({
          write(data) {
            console.log(data);
          }
        }));
    
        await webContainer.spawn('npm', ['run', 'dev']);
    
        // Wait for `server-ready` event
        webContainer.on('server-ready', (port, url) => {
          // ...
          console.log(url)
          console.log(port)
          setUrl(url);
        });
    }

    useEffect(() => {
        main();
    },[])

    return (
        <div className="h-full flex items-center justify-center text-gray-400">
          {!url && <div className="text-center">
            <p className="mb-2">Loading...</p>
          </div>}
          {url && <iframe width={"100%"} height={"100%"} src={url} />}
        </div>
      );
}