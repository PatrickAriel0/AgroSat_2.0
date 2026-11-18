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

      <p className="mt-4 text-sm text-agro-muted">
        Fonte: IBGE, Mapa de Solos do Brasil (escala 1:250.000). É um mapa regional: mostra o
        solo predominante na área e não substitui a análise de laboratório da sua terra.
      </p>
    </section>
  );
}

function ResultadoSolo({ solo }: { solo: SoloInfo }) {
  const ordem = solo.ordem ?? acharOrdem(solo.descricao);
  const explicacao = ordem ? SOLOS_SIBCS[ordem] : undefined;

  return (
    <div>
      <p className="font-heading text-3xl font-bold text-agro-primary" data-testid="solo-nome">
        {solo.descricao}
      </p>
      {ordem && (
        <p className="mt-1 text-sm text-agro-muted">Ordem do solo: {ordem}</p>
      )}

      {explicacao ? (
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-agro-bg px-3 py-2">
            <dt className="text-sm text-agro-muted">Como é esse solo</dt>
            <dd className="text-base text-agro-white">{explicacao.resumo}</dd>
          </div>
          <div className="rounded-lg bg-agro-bg px-3 py-2">
            <dt className="text-sm text-agro-muted">Atenção</dt>
            <dd className="text-base text-agro-white">{explicacao.atencao}</dd>
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
