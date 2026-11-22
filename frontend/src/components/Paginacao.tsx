interface PaginacaoProps {
  pagina: number;
  temProxima: boolean;
  aoMudar: (pagina: number) => void;
}

export default function Paginacao({ pagina, temProxima, aoMudar }: PaginacaoProps) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
      <button onClick={() => aoMudar(pagina - 1)} disabled={pagina === 1}>
        Anterior
      </button>
      <span>Página {pagina}</span>
      <button onClick={() => aoMudar(pagina + 1)} disabled={!temProxima}>
        Próxima
      </button>
    </div>
  );
}