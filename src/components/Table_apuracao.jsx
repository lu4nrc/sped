import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import formatBRL from "@/utils/formatBRL";
import { format } from "date-fns";

const TableApuracao = ({ e110, info }) => {
  console.log(info[0].nome);
  return (
    <Card className="overflow-hidden flex-2">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            APURAÇÃO DO ICMS
          </CardTitle>

          <CardDescription>
            <p>{info[0].nome}</p>
            <p className="text-xs text-muted-foreground">{format(new Date(info[0].dt_ini), "yyyy-MM-dd")}</p>
          </CardDescription>
        </div>
      </CardHeader>
      {e110 && (
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <ul className="grid gap-3">
              <li key="1" className="flex justify-between">
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  Valor total dos débitos do Imposto:
                </span>
                <span>{e110 ? formatBRL(e110.vl_tot_debitos) : "0,00"}</span>
              </li>
              <li key="2" className="flex justify-between">
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  Valores total ajustes a débito (doc fiscal):
                </span>
                <span>{e110 ? formatBRL(e110.vl_aj_debitos) : "0,00"}</span>
              </li>
              <li key="3" className="flex justify-between">
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  Valores total ajustes a débito:
                </span>
                <span>{e110 ? formatBRL(e110.vl_tot_aj_debitos) : "0,00"}</span>
              </li>
              <li key="4" className="flex justify-between">
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  Valor total dos extornos de créditos:
                </span>
                <span>{e110 ? formatBRL(e110.vl_estornos_cred) : "0,00"}</span>
              </li>
              <li key="5" className="flex justify-between">
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  Valor total dos créditos do Imposto:
                </span>
                <span>{e110 ? formatBRL(e110.vl_tot_creditos) : "0,00"}</span>
              </li>
              <li key="6" className="flex justify-between">
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  Valor total ajustes a crédito (doc fiscal):
                </span>
                <span>{e110 ? formatBRL(e110.vl_aj_creditos) : "0,00"}</span>
              </li>
              <li key="7" className="flex justify-between">
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  Valor total dos ajustes a crédito:
                </span>
                <span>
                  {e110 ? formatBRL(e110.vl_tot_aj_creditos) : "0,00"}
                </span>
              </li>
              <li key="8" className="flex justify-between">
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  Valor total dos estornos de déditos:
                </span>
                <span>{e110 ? formatBRL(e110.vl_stornos_deb) : "0,00"}</span>
              </li>
              <li key="9" className="flex justify-between">
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  Saldo credor do périodo anterior:
                </span>
                <span>{e110 ? formatBRL(e110.vl_sld_credor_ant) : "0,00"}</span>
              </li>
              <li key="10" className="flex justify-between">
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  Valor do saldo devedor:
                </span>
                <span>{e110 ? formatBRL(e110.vl_sld_apurado) : "0,00"}</span>
              </li>
              <li key="11" className="flex justify-between">
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  Valor total das deduções
                </span>
                <span>{e110 ? formatBRL(e110.vl_tot_ded) : "0,00"}</span>
              </li>
              <li key="12" className="flex justify-between">
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  Valor total do ICMS a recolher
                </span>
                <span>{e110 ? formatBRL(e110.vl_icms_recolher) : "0,00"}</span>
              </li>
              <li key="13" className="flex justify-between">
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  Valor do saldo credor do ICMS
                </span>
                <span>
                  {e110 ? formatBRL(e110.vl_sld_credor_transportar) : "0,00"}
                </span>
              </li>
              <li key="14" className="flex justify-between">
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  Valores recolhidos ou a recolher, extra-apuração:
                </span>

                <span>{e110 ? formatBRL(e110.deb_esp) : "0,00"}</span>
              </li>
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default TableApuracao;
