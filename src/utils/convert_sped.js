import { parse } from "date-fns";
import formatarCNPJ from "./formatCNPJ";
import { cfopBase } from "./cfop";

export default function convert_sped(files) {
  const datafull = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i].split("\n");

    const organize = organizeData(file, i);
    datafull.push(organize);
  }

  function convertToDate(dateString) {
    const formattedDateString = `${dateString.slice(0, 2)}/${dateString.slice(
      2,
      4
    )}/${dateString.slice(4)}`;
    const parsedDate = parse(formattedDateString, "dd/MM/yyyy", new Date());
    return parsedDate;
  }

  function organizeData(file, i) {
    const data = {
      id: i,
      headersFiles: [],
      generic: [],
      c100: {
        resum: {
          entrada: { total: 0, qtd: 0, vl_t_icms: 0 },
          saida: { total: 0, qtd: 0, vl_t_icms: 0 },
        },
        data: [],
      },
      c190: [],
      cfop_map: {},
      c190_vl_opr_total: 0,
      e110: {},
    };
    file.forEach((line) => {
      const columns = line.split("|");

      switch (columns[1]) {
        case "0000":
          // Processar dados do registro 0000
          data.mes = columns[5].substring(2, 4);

          data.headersFiles.push({
            reg: "0000",
            cod_ver: columns[2],
            cod_fin: +columns[3],
            dt_ini: convertToDate(columns[4]),
            dt_fin: convertToDate(columns[5]),
            nome: columns[6],
            cnpj: formatarCNPJ(columns[7]),
            cpf: columns[8],
            uf: columns[9],
            ie: columns[10],
            cod_mun: columns[11],
            im: columns[12],
            suframa: columns[13],
            ind_perfil: columns[14],
            ind_ativ: columns[15],
          });
          break;
        case "0001":
          // Abertura do bloco 0
          data.generic.push({
            reg: "0001",
            ind_mov: columns[2],
          });
          break;
        case "0002":
          // classificacao do estabelecimento industrial ou equiparado a industrial
          data.generic.push({
            reg: "0002",
            clas_estab_ind: columns[2],
          });
          break;
        case "0005":
          // Dados complementares da entidade
          data.generic.push({
            reg: "0005",
            fantasia: columns[2],
            cep: columns[3],
            end: columns[4],
            num: columns[5],
            compl: columns[6],
            bairro: columns[7],
            fone: columns[8],
            fax: columns[9],
            email: columns[10],
          });
          break;
        case "0015":
          // dados do contribuinte substituto ou responsavel pelo icms destino
          data.generic.push({
            reg: "0015",
            uf_st: columns[2],
            ie_st: columns[3],
          });
          break;
        case "0100":
          // Dados do contabilista
          data.generic.push({
            reg: "0100",
            nome: columns[2],
            cpf: columns[3],
            crc: columns[4],
            cnpj: columns[5],
            cep: columns[6],
            end: columns[7],
            num: columns[8],
            compl: columns[9],
            bairro: columns[10],
            fone: columns[11],
            fax: columns[12],
            email: columns[13],
            cod_mun: columns[14],
          });
          break;
        case "0150":
          // Tabela de cadastro do participante
          data.generic.push({
            reg: "0150",
            cod_part: columns[2],
            nome: columns[3],
            cod_pais: columns[4],
            cnpj: columns[5],
            cpf: columns[6],
            ie: columns[7],
            cod_mun: columns[8],
            suframa: columns[9],
            end: columns[10],
            num: columns[11],
            compl: columns[12],
            bairro: columns[13],
          });
          break;
        case "0175":
          // Alteracao da tabela de cadastro de participante
          data.generic.push({
            reg: "0175",
            dt_alt: columns[2],
            nr_campo: columns[3],
            cont_ant: columns[4],
          });
          break;
        case "0190":
          // Identificacao das unidades de medida
          data.generic.push({
            reg: "0190",
            unid: columns[2],
            descr: columns[3],
          });
          break;
        case "0200":
          // Tabela de identificacao do item (Produto e servicos)
          data.generic.push({
            reg: "0200",
            cod_item: columns[2],
            descr_item: columns[3],
            cod_barra: columns[4],
            cod_ant_item: columns[5],
            unid_inv: columns[6],
            tipo_item: columns[7],
            cod_ncm: columns[8],
            ex_ipi: columns[9],
            cod_gen: columns[10],
            cod_lst: columns[11],
            aliq_icms: columns[12],
            cest: columns[13],
          });
          break;

        case "0205":
          // Alteracao do item
          data.generic.push({
            reg: "0205",
            descr_ant_item: columns[2],
            dt_ini: columns[3],
            dt_fim: columns[4],
            cod_ant_item: columns[5],
          });
          break;
        case "0206":
          // Cod. de produto conforme tabela publicada pela anp
          data.generic.push({
            reg: "0206",
            cod_comb: columns[2],
          });
          break;
        case "0210":
          // Consumo especifico padronizado
          data.generic.push({
            reg: "0210",
            cod_item_comp: columns[2],
            qtd_comp: columns[3],
            perda: columns[4],
          });
          break;
        case "0220":
          // Fatores de conversao de unidades
          data.generic.push({
            reg: "0220",
            unid_conv: columns[2],
            fat_conv: columns[3],
            cod_barra: columns[4],
          });
          break;
        case "0221":
          // correlacao entre codigos de itens comercializados
          data.generic.push({
            reg: "0221",
            cod_item_atomico: columns[2],
            qtd_contida: columns[3],
          });
          break;

        case "0300":
          // Cadastro de bens ou componentes do ativo imobilizado
          data.generic.push({
            reg: "0300",
            cod_ind_bem: columns[2],
            ident_merc: columns[3],
            descr_item: columns[4],
            cod_prnc: columns[5],
            cod_cta: columns[6],
            nr_parc: columns[7],
          });
          break;
        case "0305":
          // Informacao sobre a atilizacao do bem
          data.generic.push({
            reg: "0305",
            cod_ccus: columns[2],
            func: columns[3],
            vida_util: columns[4],
          });
          break;
        case "0400":
          // Tabela de natureza da operacao/prestacao
          data.generic.push({
            reg: "0400",
            cod_nat: columns[2],
            descr_nat: columns[3],
          });
          break;
        case "0450":
          // Tabela de informacao complementar do documento fiscal
          data.generic.push({
            reg: "0450",
            cod_inf: columns[2],
            txt: columns[3],
          });
          break;
        case "0460":
          // Tabela de observacao do lancamento fiscal
          data.generic.push({
            reg: "0460",
            cod_obs: columns[2],
            txt: columns[3],
          });
          break;
        case "0500":
          // Plano de contas contabeis
          data.generic.push({
            reg: "0500",
            dt_alt: columns[2],
            cod_nat_cc: columns[3],
            ind_cta: columns[4],
            nivel: columns[5],
            cod_cta: columns[6],
            nome_cta: columns[7],
          });
          break;
        case "0600":
          // Centro de custos
          data.generic.push({
            reg: "0600",
            dt_alt: columns[2],
            cod_ccus: columns[3],
            ccus: columns[4],
          });
          break;
        case "0990":
          // Encerramento do bloco 0
          data.generic.push({
            reg: "0990",
            qtd_lin_0: columns[2],
          });
          break;
        case "B001":
          // Abertura do bloco B
          data.generic.push({
            reg: "B001",
            ind_dad: columns[2],
          });
          break;
        case "B020":
          // NOTA FISCAL (CÓDIGO 01), NOTA FISCAL DE SERVIÇOS (CÓDIGO 03), NOTA FISCAL DE SERVIÇOS AVULSA (CÓDIGO 3B), NOTA FISCAL DE PRODUTOR (CÓDIGO 04), CONHECIMENTO DE TRANSPORTE RODOVIÁRIO DE CARGAS (CÓDIGO 08), NF-e (CÓDIGO 55), NFC-e (CÓDIGO 65) e NF3-e (CÓDIGO 66)
          data.generic.push({
            reg: "B020",
            ind_oper: columns[2],
            ind_emit: columns[3],
            cod_part: columns[4],
            cod_mod: columns[5],
            cod_sit: columns[6],
            ser: columns[7],
            num_doc: columns[8],
            chv_nfe: columns[9],
            dt_doc: columns[10],
            cod_mun_serv: columns[11],
            vl_cont: columns[12],
            vl_mat_terc: columns[13],
            vl_sub: columns[14],
            vl_isnt_iss: columns[15],
            vl_ded_bc: columns[16],
            vl_bc_iss: columns[17],
            vl_bc_iss_rt: columns[18],
            vl_iss_rt: columns[19],
            vl_iss: columns[20],
            cod_inf_obs: columns[21],
          });
          break;
        case "B025":
          // DETALHAMENTO POR COMBINAÇÃO DE ALÍQUOTA E ITEM DA LISTA DE SERVIÇOS DA LC 116/2003)
          data.generic.push({
            reg: "B025",
            vl_cont_p: columns[2],
            vl_bc_iss_p: columns[3],
            aliq_iss: columns[4],
            vl_iss_p: columns[5],
            vl_isnt_iss_p: columns[6],
            cod_serv: columns[7],
          });
          break;
        case "B030":
          // NOTA FISCAL DE SERVIÇOS SIMPLIFICADA (CÓDIGO 3A)
          data.generic.push({
            reg: "B030",
            cod_mod: columns[2],
            ser: columns[3],
            num_doc_ini: columns[4],
            num_doc_fin: columns[5],
            dt_doc: columns[6],
            qtd_canc: columns[7],
            vl_cont: columns[8],
            vl_isnt_iss: columns[9],
            vl_bc_iss: columns[10],
            vl_iss: columns[11],
            cod_inf_obs: columns[12],
          });
          break;
        case "B035":
          // DETALHAMENTO POR COMBINAÇÃO DE ALÍQUOTA E ITEM DA LISTA DE SERVIÇOS DA LC 116/2003)
          data.generic.push({
            reg: "B035",
            vl_cont_p: columns[2],
            vl_bc_iss_p: columns[3],
            aliq_iss: columns[4],
            vl_iss_p: columns[5],
            vl_isnt_iss_p: columns[6],
            cod_serv: columns[7],
          });
          break;
        case "B350":
          // SERVIÇOS PRESTADOS POR INSTITUIÇÕES FINANCEIRAS
          data.generic.push({
            reg: "B350",
            cod_ctd: columns[2],
            cta_iss: columns[3],
            cta_cosif: columns[4],
            qtd_ocor: columns[5],
            cod_serv: columns[6],
            vl_cont: columns[7],
            vl_bc_iss: columns[8],
            aliq_iss: columns[9],
            vl_iss: columns[10],
            cod_inf_obs: columns[11],
          });
          break;
        case "B420":
          // TOTALIZAÇÃO DOS VALORES DE SERVIÇOS PRESTADOS POR COMBINAÇÃO DE ALÍQUOTA E ITEM DA LISTA DE SERVIÇOS DA LC 116/2003
          data.generic.push({
            reg: "B420",
            vl_cont: columns[2],
            vl_bc_iss: columns[3],
            aliq_iss: columns[4],
            vl_isnt_iss: columns[5],
            vl_iss: columns[6],
            cod_serv: columns[7],
          });
          break;
        case "B440":
          //
          data.generic.push({
            reg: "B440",
            ind_oper: columns[2],
            cod_part: columns[3],
            vl_cont_rt: columns[4],
            vl_bc_iss_rt: columns[5],
            vl_iss_rt: columns[6],
          });
          break;
        case "B470":
          //
          data.generic.push({
            reg: "B470",
            vl_cont: columns[2],
            vl_mat_terc: columns[3],
            vl_mat_prop: columns[4],
            vl_sub: columns[5],
            vl_isnt: columns[6],
            vl_ded_bc: columns[7],
            vl_bc_iss: columns[8],
            vl_bc_iss_rt: columns[9],
            vl_iss: columns[10],
            vl_iss_rt: columns[11],
            vl_ded: columns[12],
            vl_iss_rec: columns[13],
            vl_iss_st: columns[14],
            vl_iss_rec_uni: columns[15],
          });
          break;
        case "B500":
          //
          data.generic.push({
            reg: "B500",
            vl_rec: columns[2],
            qtd_prof: columns[3],
            vl_or: columns[4],
          });
          break;
        case "B510":
          //
          data.generic.push({
            reg: "B510",
            ind_prof: columns[2],
            ind_esc: columns[3],
            ind_soc: columns[4],
            cpf: columns[5],
            nome: columns[6],
          });
          break;
        case "B990":
          //
          data.generic.push({
            reg: "B990",
            qtd_lin_b: columns[2],
          });
          break;
        case "C001":
          //
          data.generic.push({
            reg: "C001",
            ind_mov: columns[2],
          });
          break;
        case "C100":
          if (!columns[12]) {
            break;
          }
          //
          data.c100.data.push({
            reg: "C100",
            ind_oper: columns[2] === "0" ? "Entrada" : "Saida",
            ind_emit: columns[3],
            cod_part: columns[4],
            cod_mod: columns[5],
            cod_sit: columns[6],
            ser: columns[7],
            num_doc: columns[8],
            chv_nfe: columns[9],
            dt_doc: columns[10],
            dt_e_s: columns[11],
            vl_doc: parseFloat(columns[12].replace(",", ".")),
            ind_pgto: columns[13],
            vl_desc: columns[14],
            vl_abat_nt: columns[15],
            vl_merc: columns[16],
            ind_frt: columns[17],
            vl_frt: columns[18],
            vl_seg: columns[19],
            vl_out_da: columns[20],
            vl_bc_icms: columns[21],
            vl_icms: parseFloat(columns[22].replace(",", ".")),
            vl_bc_icms_st: columns[23],
            vl_icms_st: columns[24],
            vl_ipi: columns[25],
            vl_pis: columns[26],
            vl_cofins: columns[27],
            vl_pis_st: columns[28],
            vl_cofins_st: columns[29],
          });

          if (columns[2] === "0") {
            data.c100.resum.entrada.qtd = ++data.c100.resum.entrada.qtd;

            data.c100.resum.entrada.total =
              data.c100.resum.entrada.total +
              parseFloat(columns[12].replace(",", "."));

            data.c100.resum.entrada.vl_t_icms =
              data.c100.resum.entrada.vl_t_icms +
              parseFloat(columns[22].replace(",", "."));
          } else {
            data.c100.resum.saida.qtd = ++data.c100.resum.saida.qtd;

            data.c100.resum.saida.total =
              data.c100.resum.saida.total +
              parseFloat(columns[12].replace(",", "."));

            data.c100.resum.saida.vl_t_icms =
              data.c100.resum.saida.vl_t_icms +
              parseFloat(columns[22].replace(",", "."));
          }

          break;
        case "C101":
          //
          data.generic.push({
            reg: "C101",
            vl_fcp_uf_dest: columns[2],
            vl_icms_uf_rem: columns[3],
            ind_soc: columns[4],
            cpf: columns[5],
            nome: columns[6],
          });
          break;
        case "C105":
          //
          data.generic.push({
            reg: "C105",
            oper: columns[2],
            uf: columns[3],
          });
          break;
        case "C110":
          //
          data.generic.push({
            reg: "C110",
            cod_inf: columns[2],
            txt_compl: columns[3],
          });
          break;
        case "C111":
          //
          data.generic.push({
            reg: "C111",
            num_proc: columns[2],
            ind_proc: columns[3],
          });
          break;
        case "C112":
          //
          data.generic.push({
            reg: "C112",
            cod_da: columns[2],
            uf: columns[3],
            num_da: columns[4],
            cod_aut: columns[5],
            vl_da: columns[6],
            dt_vcto: columns[7],
            dt_pgto: columns[8],
          });
          break;
        case "C113":
          //
          data.generic.push({
            reg: "C113",
            ind_oper: columns[2],
            ind_emit: columns[3],
            cod_part: columns[4],
            cod_mod: columns[5],
            ser: columns[6],
            sub: columns[7],
            num_doc: columns[8],
            dt_doc: columns[9],
            chv_doce: columns[10],
          });
          break;
        case "C114":
          //
          data.generic.push({
            reg: "C114",
            cod_mod: columns[2],
            ecf_fab: columns[3],
            ecf_cx: columns[4],
            num_doc: columns[5],
            dt_doc: columns[6],
          });
          break;
        case "C115":
          //
          data.generic.push({
            reg: "C115",
            ind_carga: columns[2],
            cnpj_col: columns[3],
            ie_col: columns[4],
            cpf_col: columns[5],
            cod_mun_col: columns[6],
            cnpj_entg: columns[7],
            ie_entg: columns[8],
            cpf_entg: columns[9],
            cod_mun_entg: columns[10],
          });
          break;
        case "C190":
          //
          data.c190.push({
            reg: "C190",
            cst_icms: columns[2],
            cfop: columns[3],
            aliq_icms: columns[4],
            vl_opr: parseFloat(columns[5].replace(",", ".")),
            vl_bc_icms: columns[6],
            vl_icms: columns[7],
            vl_bc_icms_st: columns[8],
            vl_red_bc: columns[9],
            vl_ipi: columns[10],
            cod_obs: columns[11],
          });

          let groupedData = {};

          // Iterar sobre os itens de data.c190

          data.c190_vl_opr_total =
            data.c190_vl_opr_total + parseFloat(columns[5].replace(",", "."));
          break;
        case "E110":
          //
          data.e110 = {
            reg: "E110",
            vl_tot_debitos: parseFloat(columns[2].replace(",", ".")),
            vl_aj_debitos: parseFloat(columns[3].replace(",", ".")),
            vl_tot_aj_debitos: parseFloat(columns[4].replace(",", ".")),
            vl_estornos_cred: parseFloat(columns[5].replace(",", ".")),
            vl_tot_creditos: parseFloat(columns[6].replace(",", ".")),
            vl_aj_creditos: parseFloat(columns[7].replace(",", ".")),
            vl_tot_aj_creditos: parseFloat(columns[8].replace(",", ".")),
            vl_stornos_deb: parseFloat(columns[9].replace(",", ".")),
            vl_sld_credor_ant: parseFloat(columns[10].replace(",", ".")),
            vl_sld_apurado: parseFloat(columns[11].replace(",", ".")),
            vl_tot_ded: parseFloat(columns[12].replace(",", ".")),
            vl_icms_recolher: parseFloat(columns[13].replace(",", ".")),
            vl_sld_credor_transportar: parseFloat(
              columns[14].replace(",", ".")
            ),
            deb_esp: parseFloat(columns[15].replace(",", ".")),
          };
          break;
        default:
        // Processar outros tipos de registros
        //data.generic.push({ tipo: columns[1] });
      }
    });

    let groupedData = { entrada: [], saida: [] };

    //! Separando itens por cfop
    data.c190.forEach((item) => {
      let cfop = item.cfop; //'1156'

      // Verifica se o primeiro caractere de cfop é "1" ou "2"
      if (cfop[0] === "1" || cfop[0] === "2") {
        let findCfop = groupedData.entrada.find((el) => el.cfop === cfop);

        if (!findCfop) {
          // Aqui você precisa garantir que cfopBase esteja definido
          const description = cfopBase[cfop] || "Descrição não disponível";

          groupedData.entrada.push({
            cfop: cfop,
            description: description,
            total_vl_opr: item.vl_opr,
            items: [item], // Adiciona o item inicialmente
          });
        } else {
          findCfop.total_vl_opr += item.vl_opr;
          findCfop.items.push(item);
        }
      }

      if (cfop[0] === "5" || cfop[0] === "6") {
        let findCfop = groupedData.saida.find((el) => el.cfop === cfop);

        if (!findCfop) {
          // Aqui você precisa garantir que cfopBase esteja definido
          const description = cfopBase[cfop] || "Descrição não disponível";

          groupedData.saida.push({
            cfop: cfop,
            description: description,
            total_vl_opr: item.vl_opr,
            items: [item], // Adiciona o item inicialmente
          });
        } else {
          findCfop.total_vl_opr += item.vl_opr;
          findCfop.items.push(item);
        }
      }
    });

    data.cfop_map = groupedData;

    return data;
  }

  const organize = datafull.sort((a, b) => {
    return a.mes - b.mes;
  });

  return organize;
}
