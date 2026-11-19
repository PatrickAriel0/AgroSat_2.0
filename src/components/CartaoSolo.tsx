import { useEffect, useState } from "react";
import { buscarSolo, SoloNaoEncontradoError } from "../services/solo";
import { SOLOS_SIBCS, acharOrdem } from "../data/solosSibcs";
import type { PontoMapa } from "../types/localizacao";
import type { SoloInfo } from "../types/solo";

type Estado =
  | { tipo: "vazio" }
  | { tipo: "carregando" }
  | { tipo: "ok"; solo: SoloInfo }
  | { tipo: "naoEncontrado" }
  | { tipo: "erro" };

interface Props {
  /** Ponto marcado no mapa (ou null se ainda não marcou). */
  ponto: PontoMapa | null;
}

const ATRASO_MS = 600;

export default function CartaoSolo({ ponto }: Props) {
  const [tentativa, setTentativa] = useState(0);
  const [resposta, setResposta] = useState<{ chave: string; estado: Estado } | null>(null);

  const latitude = ponto?.latitude;
  const longitude = ponto?.longitude;
  const chave =
    latitude === undefined || longitude === undefined
      ? null
      : `${latitude},${longitude},${tentativa}`;

  // O estado é derivado: só vale a resposta que pertence ao ponto atual.
  const estado: Estado =
    chave === null
      ? { tipo: "vazio" }
      : resposta?.chave === chave
        ? resposta.estado
        : { tipo: "carregando" };

  useEffect(() => {
    if (chave === null || latitude === undefined || longitude === undefined) return;

    const controle = new AbortController();

    // Espera um instante: evita consultar a cada ajuste do marcador.
    const atraso = window.setTimeout(async () => {
      try {
        const solo = await buscarSolo({ latitude, longitude }, controle.signal, tentativa > 0);
        setResposta({ chave, estado: { tipo: "ok", solo } });
      } catch (erro) {
        if (controle.signal.aborted) return;
        setResposta({
          chave,
          estado:
            erro instanceof SoloNaoEncontradoError
              ? { tipo: "naoEncontrado" }
              : { tipo: "erro" },
        });
      }
    }, ATRASO_MS);

    return () => {
      window.clearTimeout(atraso);
      controle.abort();
    };
  }, [chave, latitude, longitude]);

  return (
    <section
      aria-labelledby="titulo-solo"
      className="w-full min-w-0 rounded-2xl border border-agro-border bg-agro-card p-4 sm:p-6"
    >
      <h2
        id="titulo-solo"
        className="font-heading text-2xl font-bold text-agro-white sm:text-3xl"
      >
        Qual é o solo da sua fazenda?
      </h2>

      <div
        role="status"
        aria-live="polite"
        aria-busy={estado.tipo === "carregando"}
        className="mt-3"
      >
        {estado.tipo === "vazio" && (
          <p className="text-base text-agro-text">
            Marque a fazenda no mapa para descobrirmos o tipo de solo do local.
          </p>
        )}

        {estado.tipo === "carregando" && (
          <p className="text-base text-agro-text">Consultando o mapa de solos...</p>
        )}

        {estado.tipo === "naoEncontrado" && (
          <p className="rounded-lg border border-agro-border bg-agro-bg px-3 py-2 text-base text-agro-white">
            Não encontramos dados de solo para este ponto. O mapa cobre apenas o
            território brasileiro. Tente mover o marcador.
          </p>
        )}

        {estado.tipo === "erro" && (
          <div className="rounded-lg border border-red-400/40 bg-red-950/40 px-3 py-3">
            <p className="text-base text-red-200">
              Não foi possível consultar o solo agora. Verifique a conexão e tente de
              novo.
            </p>
            <button
              type="button"
              onClick={() => setTentativa((n) => n + 1)}
              className="mt-3 inline-flex min-h-11 items-center justify-center rounded-lg border border-agro-primary/50 px-4 text-base font-semibold text-agro-primary transition-colors hover:bg-agro-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agro-accent"
            >
              Tentar de novo
            </button>
          </div>
        )}

        {estado.tipo === "ok" && <ResultadoSolo solo={estado.solo} />}
      </div>

      <p className="mt-4 text-xs text-agro-muted">
        Fonte: ISRIC SoilGrids 2.0 (Global Soil Information) e IBGE/Embrapa Solos (SiBCS escala 1:250.000). 
        A análise de satélite mapeia o horizonte superficial e orienta o manejo hídrico, sem substituir o laudo de laboratório.
      </p>
    </section>
  );
}

function ResultadoSolo({ solo }: { solo: SoloInfo }) {
  const ordem = solo.ordem ?? acharOrdem(solo.descricao);
  const explicacao = ordem ? SOLOS_SIBCS[ordem] : undefined;
  const comp = solo.composicao;

  return (
    <div className="space-y-4">
      <div>
        <p className="font-heading text-3xl font-bold text-agro-primary" data-testid="solo-nome">
          {solo.descricao}
        </p>
        {ordem && (
          <p className="mt-1 text-sm text-agro-muted">Ordem do solo: {ordem}</p>
        )}
      </div>

      {/* Composição Granulométrica e Físico-Química (SoilGrids / SiBCS) */}
      {comp && (
        <div className="rounded-xl border border-agro-border bg-[#0e1712] p-4 sm:p-5 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#243a2d] pb-2.5">
            <div>
              <span className="text-xs uppercase tracking-wider text-agro-primary font-semibold">
                Análise Física & Granulometria
              </span>
              <h3 className="text-base font-bold text-agro-white">
                Composição do Solo ({comp.fonteDados})
              </h3>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded bg-[#1d3a2a] text-[#7cc795] border border-[#7cc795]/30 font-medium">
              Profundidade: 0-5 cm
            </span>
          </div>

          {/* Barra Visual de Composição Granulométrica */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-agro-muted">
              <span>Distribuição mineral das frações:</span>
              <span className="font-mono text-[#e6efe8]">100% total</span>
            </div>
            <div className="h-4 w-full flex rounded-full overflow-hidden border border-[#2f4838] bg-black/40">
              <div
                style={{ width: `${comp.argila}%` }}
                className="bg-[#c26338] transition-all duration-500 relative group"
                title={`Argila: ${comp.argila}%`}
              />
              <div
                style={{ width: `${comp.areia}%` }}
                className="bg-[#eab308] transition-all duration-500 relative group"
                title={`Areia: ${comp.areia}%`}
              />
              <div
                style={{ width: `${comp.silte}%` }}
                className="bg-[#10b981] transition-all duration-500 relative group"
                title={`Silte: ${comp.silte}%`}
              />
            </div>

            {/* Legenda dos 3 componentes */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#c26338] shrink-0" />
                <div className="text-xs">
                  <span className="text-agro-muted block text-[11px]">Argila</span>
                  <strong className="text-agro-white font-mono">{comp.argila}%</strong>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#eab308] shrink-0" />
                <div className="text-xs">
                  <span className="text-agro-muted block text-[11px]">Areia</span>
                  <strong className="text-agro-white font-mono">{comp.areia}%</strong>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#10b981] shrink-0" />
                <div className="text-xs">
                  <span className="text-agro-muted block text-[11px]">Silte</span>
                  <strong className="text-agro-white font-mono">{comp.silte}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Grid com Propriedades Agronômicas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-[#243a2d]">
            <div className="rounded-lg bg-agro-bg p-2.5">
              <span className="text-[11px] text-agro-muted block">pH estimado</span>
              <span className="text-base font-bold text-agro-white font-mono">{comp.ph}</span>
              <span className="text-[10px] text-agro-primary block mt-0.5">
                {comp.ph < 5.0 ? 'Ácido' : comp.ph <= 6.0 ? 'Moderado' : 'Neutro/Básico'}
              </span>
            </div>

            <div className="rounded-lg bg-agro-bg p-2.5">
              <span className="text-[11px] text-agro-muted block">Textura SiBCS</span>
              <span className="text-xs font-bold text-agro-white block truncate" title={comp.textura}>
                {comp.textura}
              </span>
              <span className="text-[10px] text-[#9fb5a6] block mt-0.5">Triângulo Textural</span>
            </div>

            <div className="rounded-lg bg-agro-bg p-2.5">
              <span className="text-[11px] text-agro-muted block">Retenção de Água</span>
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded inline-block mt-0.5 ${
                  comp.retencaoHidrica === 'Alta'
                    ? 'bg-emerald-950 text-[#7cc795] border border-[#7cc795]/30'
                    : comp.retencaoHidrica === 'Média'
                    ? 'bg-amber-950 text-amber-300 border border-amber-600/30'
                    : 'bg-blue-950 text-blue-300 border border-blue-600/30'
                }`}
              >
                {comp.retencaoHidrica}
              </span>
              <span className="text-[10px] text-[#9fb5a6] block mt-0.5">Capacidade de campo</span>
            </div>

            <div className="rounded-lg bg-agro-bg p-2.5">
              <span className="text-[11px] text-agro-muted block">Matéria Orgânica</span>
              <span className="text-base font-bold text-agro-white font-mono">{comp.materiaOrganica}%</span>
              <span className="text-[10px] text-agro-primary block mt-0.5">Horizonte superficial</span>
            </div>
          </div>
        </div>
      )}

      {explicacao ? (
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-agro-bg px-3 py-2.5">
            <dt className="text-sm text-agro-muted font-medium">Características agronômicas</dt>
            <dd className="text-sm text-agro-white mt-1 leading-relaxed">{explicacao.resumo}</dd>
          </div>
          <div className="rounded-lg bg-agro-bg px-3 py-2.5">
            <dt className="text-sm text-agro-muted font-medium">Recomendações e atenção</dt>
            <dd className="text-sm text-agro-white mt-1 leading-relaxed">{explicacao.atencao}</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-3 text-base text-agro-text">
          Este ponto não é classificado como solo agrícola no mapa (por exemplo, água ou
          rocha exposta). Se for engano, mova o marcador.
        </p>
      )}
    </div>
  );
}
