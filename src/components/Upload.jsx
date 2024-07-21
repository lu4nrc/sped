import React, { useState } from "react";
import { Button } from "./ui/button";
import { useDropzone } from "react-dropzone";
import convert_sped from "@/utils/convert_sped";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2 } from "lucide-react";

const Upload = ({ setContent }) => {
    const [open, setOpen] = useState(false)

  const [isLoadingRel, setisLoadingRel] = useState(false);
  const [filesContent, setFilesContent] = useState([]);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone();

  if (filesContent) {
    setContent(filesContent);
  }

  const handleFileRead = async () => {
    if (acceptedFiles) {
      setisLoadingRel(true);
      const promises = [];

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const promise = readFileAsync(file);
        promises.push(promise);
      }

      try {
        const contents = await Promise.all(promises);
        const data = convert_sped(contents);
        setFilesContent(data);
        setisLoadingRel(false);
        setOpen(!open)
      } catch (error) {
        console.error("Erro ao ler os arquivos:", error);
        setisLoadingRel(false);
      }
    }
  };

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result.toString());
        } else {
          reject(new Error("Erro ao ler o conteúdo do arquivo."));
        }
      };
      reader.onerror = () => {
        reader.abort();
        reject(new Error("Erro ao ler o arquivo."));
      };
      reader.readAsText(file);
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Importar arquivos sped</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Importar arquivos</DialogTitle>
            <DialogDescription>
              Selecione os arquivos TXT.
            </DialogDescription>
          </DialogHeader>
            <div
              {...getRootProps()}
              className={`dark w-full h-full rounded-lg border-dashed border-2 hover:border-gray-200 dark:bg-default-100 bg-default-800 hover:bg-default-700 transition-all
      ${
        isDragActive
          ? "border-blue-500"
          : "dark:border-default-200 border-default-500"
      }`}
            >
              <label
                htmlFor="dropzone-file"
                className="cursor-pointer w-full h-full"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full">
                  <svg
                    className={`w-10 h-10 mb-3 ${
                      isDragActive ? "text-blue-500" : "text-gray-400"
                    }`}
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  {isDragActive ? (
                    <p className="font-bold text-lg text-blue-400">
                      Solte para adicionar
                    </p>
                  ) : (
                    <>
                      <p className="mb-2 text-lg text-gray-400">
                        <span className="font-bold">Clique para enviar</span> ou
                        arraste até aqui
                      </p>
                      <p className="text-gray-400 text-sm">.txt</p>
                    </>
                  )}
                </div>
              </label>
              <input
                {...getInputProps()}
                className="hidden"
                aria-label="Choose file"
              />
            </div>
          <DialogFooter >
            <Button type="button" onClick={handleFileRead}>{isLoadingRel && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Gerar relatório</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Upload;
