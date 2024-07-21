import React, { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Upload from "@/components/Upload";
import { CfopTable } from "@/components/Table_cfop";
import TableApuracao from "@/components/Table_apuracao";

const SpedPage = () => {
  const [content, setContent] = useState([]);

  return (
    <div className="flex gap-2 justify-between w-full">
      <div className="flex gap-2 w-full justify-center">
        <Tabs defaultValue="jan" className="w-full">
          <div className="flex items-center gap-1">
            <Upload setContent={setContent} />
            <TabsList>
              {content.map((item) => {
                return <TabsTrigger value={item.mes}>{item.mes}</TabsTrigger>;
              })}
            </TabsList>
          </div>
          {content &&
            content.map((item) => {
              return (
                <TabsContent value={item.mes}>
                  <div>
                    <Card x-chunk="dashboard-05-chunk-3">
                      <CardContent className={"flex p-4 gap-4 w-full"}>
                        <TableApuracao
                          e110={item?.e110}
                          info={item?.headersFiles}
                        />
                        <div className="flex gap-3 flex-1">
                          <CfopTable
                            data={item.cfop_map.entrada}
                            icms={item.c100.resum.entrada.vl_t_icms}
                            title={"Entrada"}
                            titleTwo="Crédito ICMS"
                          />
                          <CfopTable
                            data={item?.cfop_map.saida}
                            icms={item?.c100.resum.saida.vl_t_icms}
                            title={"Saída"}
                            titleTwo={"Débito ICMS"}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              );
            })}
        </Tabs>
      </div>
      <div></div>
    </div>
  );
};

export default SpedPage;
