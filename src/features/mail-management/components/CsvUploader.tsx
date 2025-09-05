/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { useCSVReader } from 'react-papaparse';
import { ParseResult } from 'papaparse';
import DeleteIcon from '/icons/delete.svg';
import { UploadedFile } from '@/features/mail-management/types/mail';

interface CsvUploaderProps {
  uploadedFiles: UploadedFile[];
  onUploadAccepted: (results: ParseResult<string[]>, file: File) => void;
  onUploadError: () => void;
  onRemoveFile: (fileId: number) => void;
}

export function CsvUploader({
  uploadedFiles,
  onUploadAccepted,
  onUploadError,
  onRemoveFile,
}: CsvUploaderProps) {
  const { CSVReader } = useCSVReader();

  const handleDownloadExample = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,name,email\n홍길동,hong@example.com\n김구글,kim@example.com';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'example_recipients.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-4">
      <CSVReader
        onUploadAccepted={onUploadAccepted}
        onUploadError={onUploadError}
        noDrag
        config={{ header: false, skipEmptyLines: true }}
      >
        {({ getRootProps }: any) => (
          <div className="flex flex-1 flex-row gap-4">
            <Button
              type="button"
              {...getRootProps()}
              className="px-4 py-3 text-white"
            >
              CSV 업로드
            </Button>
            <Button
              type="button"
              onClick={handleDownloadExample}
              className="px-4 py-3"
            >
              예시 파일 다운로드
            </Button>
          </div>
        )}
      </CSVReader>

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
