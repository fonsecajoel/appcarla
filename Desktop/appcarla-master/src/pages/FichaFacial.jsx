import { useStore } from '../store/useStore';

export default function FichaFacial({ client }) {
  const { updateClient } = useStore();

  const handleChange = (field, value) => {
    updateClient(client.id, 'fichaFacial', { [field]: value });
  };

  const data = client.fichaFacial || {};

  const Input = ({ label, field, type = 'text', placeholder = '' }) => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={data[field] || ''}
        onChange={(e) => handleChange(field, e.target.value)}
      />
    </div>
  );

  const Textarea = ({ label, field, rows = 3 }) => (
    <div className="form-group">
      <label>{label}</label>
      <textarea
        rows={rows}
        value={data[field] || ''}
        onChange={(e) => handleChange(field, e.target.value)}
        style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--clr-border)', background: 'var(--clr-input-bg)', color: 'var(--clr-text-main)', resize: 'vertical' }}
      />
    </div>
  );

  const YesNo = ({ label, field, fieldObs }) => (
    <div className="form-group" style={{ marginBottom: '1rem', background: 'var(--clr-sidebar)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
      <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>{label}</label>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <label className="checkbox-label">
          <input type="radio" name={field} value="sim" checked={data[field] === 'sim'} onChange={() => handleChange(field, 'sim')} />
          Sim
        </label>
        <label className="checkbox-label">
          <input type="radio" name={field} value="não" checked={data[field] === 'não'} onChange={() => handleChange(field, 'não')} />
          Não
        </label>
      </div>
      {fieldObs && data[field] === 'sim' && (
        <input
          type="text"
          placeholder="Qual/Observações?"
          value={data[fieldObs] || ''}
          onChange={(e) => handleChange(fieldObs, e.target.value)}
          style={{ marginTop: '0.5rem' }}
        />
      )}
    </div>
  );

  const SelectField = ({ label, field, options }) => (
    <div className="form-group">
      <label>{label}</label>
      <select value={data[field] || ''} onChange={(e) => handleChange(field, e.target.value)}>
        <option value="">Selecione...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const SectionTitle = ({ children }) => (
    <h3 style={{ marginBottom: '1rem', color: 'var(--clr-primary)', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>{children}</h3>
  );

  return (
    <div className="animate-fade-in">
      <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Ficha de Anamnese Facial</h2>

      <SectionTitle>Dados do Cliente</SectionTitle>
      <div className="grid grid-cols-3 mb-6">
        <Input label="Nome" field="nome" />
        <Input label="Data de Nascimento" field="data_nasc" type="date" />
        <Input label="Morada" field="morada" />
        <Input label="Telefone" field="telefone" />
        <Input label="Profissão" field="profissao" />
      </div>

      <SectionTitle>Saúde do Cliente</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <YesNo label="Gestante?" field="gestante" />
        <YesNo label="Lactante?" field="lactante" />
        <YesNo label="Fumador(a)?" field="fumador" />
        <YesNo label="HIV?" field="hiv" />
        <YesNo label="Cancro?" field="cancro" />
        <YesNo label="Depressão?" field="depressao" />
        <YesNo label="Epilepsia?" field="epilepsia" />
        <YesNo label="Hemofilia?" field="hemofilia" />
        <YesNo label="Problemas Circulatórios?" field="circulatorios" />
        <YesNo label="Herpes?" field="herpes" />
        <YesNo label="Queloide?" field="queloide" />
        <YesNo label="Anemia?" field="anemia" />
        <YesNo label="Cardiopatia?" field="cardiopatia" />
        <YesNo label="Marca-passo?" field="marcapasso" />
        <YesNo label="Diabetes?" field="diabetes" />
        <YesNo label="Glaucoma?" field="glaucoma" />
        <YesNo label="Prótese?" field="protese" />
        <YesNo label="Roacutan?" field="roacutan" />
        <YesNo label="Aspirina?" field="aspirina" />
        <YesNo label="Ácidos Faciais?" field="acidos_faciais" />
        <YesNo label="Hipertensão?" field="hipertensao" />
        <YesNo label="Anticoncepcional?" field="anticoncepcional" fieldObs="anticoncepcional_qual" />
        <YesNo label="Menopausa?" field="menopausa" />
      </div>

      <SectionTitle>Tratamentos / Medicamentos</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <YesNo label="Está em algum tratamento?" field="em_tratamento" fieldObs="tratamento_qual" />
        <Input label="Quanto tempo?" field="tratamento_tempo" />
        <YesNo label="Faz uso de Medicamentos?" field="medicamentos" fieldObs="medicamentos_quais" />
      </div>

      <SectionTitle>Hábitos do Cliente</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <YesNo label="Ingere bastante água diariamente?" field="agua" />
        <YesNo label="Ingere bebidas alcoólicas?" field="alcool" />
        <YesNo label="Costuma dormir bem?" field="sono" />
        <YesNo label="Possui uma alimentação balanceada?" field="alimentacao" />
        <YesNo label="Pratica atividade física?" field="atividade_fisica" />
        <YesNo label="Fica exposto ao sol por longos períodos?" field="sol" />
        <YesNo label="Já fez algum procedimento antes?" field="procedimento_ant" fieldObs="procedimento_ant_qual" />
      </div>

      <SectionTitle>Análise de Caso</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <YesNo label="Cirurgia facial no último ano?" field="cirurgia_facial" />
        <YesNo label="Algum produto injetado na região?" field="produto_injetado" fieldObs="produto_injetado_qual" />
        <YesNo label="Cicatriz no local?" field="cicatriz" />
        <YesNo label="Faz uso de ácidos?" field="acidos" fieldObs="acidos_quais" />
        <YesNo label="Faz uso diário de protetor solar?" field="protetor_solar" fieldObs="protetor_solar_qual" />
      </div>

      <SectionTitle>Avaliação Física</SectionTitle>
      <div className="grid grid-cols-3 mb-6">
        <SelectField label="Tipo de Pele" field="tipo_pele" options={['Oleosa', 'Normal', 'Seca', 'Mista']} />
        <SelectField label="Espessura da Pele" field="espessura_pele" options={['Espessa', 'Fina', 'Muito fina']} />
        <SelectField label="Hidratação" field="hidratacao" options={['Normal', 'Desidratada']} />
        <SelectField label="Fototipo" field="fototipo" options={['I', 'II', 'III', 'IV', 'V', 'VI']} />
        <SelectField label="Sensibilidade" field="sensibilidade" options={['Normal', 'Sensível', 'Muito sensível']} />
      </div>
      <Textarea label="Observações (Avaliação Física)" field="avaliacao_fisica_obs" rows={4} />

      <SectionTitle>Cuidados em Casa</SectionTitle>
      <Textarea label="Cuidados recomendados" field="cuidados_casa" rows={4} />

      <SectionTitle>Informações do Procedimento</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <Input label="Data da 1ª Sessão" field="data_1sessao" type="date" />
        <Input label="Técnica Realizada" field="tecnica_1sessao" />
        <Input label="Materiais Utilizados" field="materiais_1sessao" />
        <Textarea label="Observações" field="obs_1sessao" rows={2} />
        <YesNo label="Necessário Retoque?" field="retoque" />
        <Input label="Data da 2ª Sessão" field="data_2sessao" type="date" />
        <Input label="Técnica da 2ª Sessão" field="tecnica_2sessao" />
        <Input label="Materiais 2ª Sessão" field="materiais_2sessao" />
        <Textarea label="Observações 2ª Sessão" field="obs_2sessao" rows={2} />
      </div>

      <SectionTitle>Valor e Autorização</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <Input label="Procedimento" field="procedimento_nome" />
        <Input label="Valor (€)" field="procedimento_valor" type="number" />
        <Input label="Forma de Pagamento" field="procedimento_pagamento" />
        <Input label="Prazo para ver resultado (dias)" field="prazo_resultado" type="number" />
      </div>

      <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--clr-sidebar)', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-primary)' }}>
        <h4 style={{ marginBottom: '1rem' }}>Autorização de Imagem</h4>
        <label className="checkbox-label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
          <input
            type="checkbox"
            checked={!!data.autoriza_imagem}
            onChange={(e) => handleChange('autoriza_imagem', e.target.checked)}
          />
          Autorizo gratuitamente o registo fotográfico e exibição da minha imagem para comparação antes/depois e publicidade.
        </label>
        <label className="checkbox-label" style={{ fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={!!data.termo_aceito}
            onChange={(e) => handleChange('termo_aceito', e.target.checked)}
          />
          Declaro que as afirmações acima são verdadeiras. Li e aceito os termos de responsabilidade.
        </label>
      </div>
    </div>
  );
}
