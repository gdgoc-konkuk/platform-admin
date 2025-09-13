/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { ParseResult } from 'papaparse';
import DeleteIcon from '/icons/delete.svg';
import { UploadedFile } from '@/features/mail-management/types/mail';

interface CsvUploaderProps {
  uploadedFiles: UploadedFile[];
  onUploadAccepted: (results: ParseResult<string[]>, file: File) => void;
  onUploadError: () => void;
  onRemoveFile: (fileId: number) => void;
  exampleFileUrl?: string;
  exampleFileName?: string;
}

export function CsvUploader({
  uploadedFiles,
  onUploadAccepted,
  onUploadError,
  onRemoveFile,
  exampleFileUrl,
  exampleFileName,
}: CsvUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    import('papaparse').then(({ default: Papa }) => {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results: ParseResult<string[]>) => {
          onUploadAccepted(results, file);
        },
        error: () => {
          onUploadError();
        },
      });
    });
    e.target.value = '';
  };

  const handleDownloadExample = () => {
    if (exampleFileUrl) {
      const link = document.createElement('a');
      link.setAttribute('href', exampleFileUrl);
      if (exampleFileName) {
        link.setAttribute('download', exampleFileName);
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-row mt-4 gap-4">
        <Button
          asChild
          type="button"
          className="px-4 py-3 text-white relative overflow-hidden"
        >
          <span>
            CSV 업로드
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              style={{ width: '100%', height: '100%' }}
              tabIndex={-1}
            />
          </span>
        </Button>
        {exampleFileUrl && (
          <Button
            type="button"
            onClick={handleDownloadExample}
            className="px-4 py-3"
          >
            예시 파일 다운로드
          </Button>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        {uploadedFiles.map(({ file, id }) => (
          <div
            key={id}
            className="relative flex items-center border border-gray-300 rounded px-4 py-2 bg-white shadow"
          >
            <span className="text-sm font-medium max-w-[200px] truncate">
              {file.name}
            </span>
            <button
              type="button"
              onClick={() => onRemoveFile(id)}
              className="absolute top-[-10px] right-[-10px] flex h-6 w-6 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="파일 삭제"
            >
              <img src={DeleteIcon} alt="삭제" className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
