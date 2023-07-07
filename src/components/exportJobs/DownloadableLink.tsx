export default function DownloadableLink({downloadable}: {downloadable: EHIApp.ExportManifestFileEntry}) {
  const { url, type, count} = downloadable

  return <a href={url} target="_blank" rel="noreferrer">
    {type}{count ? `(${count})` : ''}
  </a>
};
