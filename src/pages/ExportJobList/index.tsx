import { useEffect, useState } from "react";
import getExportJobs from "../../lib/getExportJobs";
// import { useSMARTContext } from "../../context/smartContext";
import Button from "../../components/Button";
import { ExportJob } from "../../types";

export default function ExportJobList() {
  // const SMART = useSMARTContext();
  const [url, setUrl] = useState<string>("http://localhost:49632");
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  // const { completeAuthorization } = SMART;
  async function jobsUpdate() {
    const response = await getExportJobs(url);
    setJobs(response);
  }
  // Load jobs on page render
  useEffect(() => {
    jobsUpdate();
  }, []);

  return (
    <>
      <h1>Jobs</h1>
      <div className="space-x-2">
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        {/* To test against other URLs  */}
        <Button onClick={() => jobsUpdate}>Refresh Jobs</Button>
      </div>
      <ul>
        {jobs.map((job, i) => (
          <li key={i}>{JSON.stringify(job)}</li>
        ))}
      </ul>
      {/* <CodeBlock>{JSON.stringify(SMART, null, 4)}</CodeBlock> */}
    </>
  );
}
