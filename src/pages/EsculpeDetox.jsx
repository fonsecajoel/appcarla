import { useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { storeAPI } from '../store/useStore';

const Input = ({ label, field, type = 'text', placeholder = '', value, onChange, onBlur }) => (
  <div className="form-group">
    <label>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      onBlur={() => onBlur(field)}
    />
  </div>
);

const Textarea = ({ label, field, rows = 3, value, onChange, onBlur }) => (
  <div className="form-group">
    <label>{label}</label>
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      onBlur={() => onBlur(field)}
      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--clr-border)', background: 'var(--clr-input-bg)', color: 'var(--clr-text-main)', resize: 'vertical' }}
    />
  </div>
);

const CheckboxGroup = ({ label, field, options, value, onToggle }) => (
  <div className="form-group" style={{ marginBottom: '1rem' }}>
    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{label}</label>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
      {options.map(opt => (
        <label key={opt} className="checkbox-label">
          <input
            type="checkbox"
            checked={!!(value || []).includes(opt)}
            onChange={(e) => onToggle(field, opt, e.target.checked)}
          />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

const RadioGroup = ({ label, field, options, value, onChange }) => (
  <div className="form-group" style={{ marginBottom: '1rem', background: 'var(--clr-sidebar)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{label}</label>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {options.map(opt => (
        <label key={opt} className="checkbox-label">
          <input type="radio" name={field} value={opt} checked={value === opt} onChange={() => onChange(field, opt)} />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

const ScoreField = ({ label, field, checked, onChange }) => (
  <div className="form-group" style={{ marginBottom: '0.75rem', background: 'var(--clr-sidebar)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
    <label className="checkbox-label" style={{ fontWeight: 500 }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(field, e.target.checked)} />
      {label}
    </label>
  </div>
);

const SectionTitle = ({ children, marginTop = false }) => (
  <h3 style={{ marginBottom: '1rem', marginTop: marginTop ? '1.5rem' : undefined, color: 'var(--clr-primary)', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>{children}</h3>
);

const protocolosOptions = [
  'Esculpe Detox', 'Esculpe Detox Week', 'Esculpe Detox Facial',
  'Esculpe 40+', 'Esculpe Detox SPA', 'Esculpe 21', 'Esculpe 60+', 'Esculpe (+)'
];
const habitosAlimentaresOptions = [
  'Farinhas brancas', 'Frituras', 'Frutas', 'Farinhas integrais',
  'Lactose', 'Açúcar', 'Industrializados', 'Sementes', 'Legumes', 'Fibras'
];
const liquidosOptions = ['Água', 'Suco natural', 'Suco Industrializado', 'Refrigerante', 'Álcool', 'Chá', 'Café'];
const contraceptivosOptions = ['Pílula', 'Diu (mirena)', 'Diu (cobre)', 'Adesivo', 'Implante', 'Menopausa', 'Nenhum'];
const acompanhamentoOptions = [
  'Cardiologista', 'Dermatologista', 'Nutrólogo', 'Psicólogo', 'Ginecologista',
  'Personal Trainer', 'Traumatologista', 'Nutricionista', 'Med. Integrativa',
  'Psiquiatra', 'Coach', 'Nenhum destes'
];

export default function EsculpeDetox({ client }) {
  const { id } = useParams();
  const clientId = client?.id || id;
  const clientData = client || storeAPI.getClient(clientId);
  const initial = clientData?.esculpeDetox || {};

  const [data, setData] = useState(initial);
  const idRef = useRef(clientId);

  if (idRef.current !== clientId) {
    idRef.current = clientId;
    setData(storeAPI.getClient(clientId)?.esculpeDetox || {});
  }

  const handleChange = useCallback((field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleBlur = useCallback((field) => {
    setData(prev => {
      storeAPI.updateClient(clientId, 'esculpeDetox', { [field]: prev[field] });
      return prev;
    });
  }, [clientId]);

  const handleToggle = useCallback((field, opt, checked) => {
    setData(prev => {
      const current = prev[field] || [];
      const updated = checked ? [...current, opt] : current.filter(v => v !== opt);
      storeAPI.updateClient(clientId, 'esculpeDetox', { [field]: updated });
      return { ...prev, [field]: updated };
    });
  }, [clientId]);

  const handleRadio = useCallback((field, value) => {
    setData(prev => {
      storeAPI.updateClient(clientId, 'esculpeDetox', { [field]: value });
      return { ...prev, [field]: value };
    });
  }, [clientId]);

  const handleCheck = useCallback((field, checked) => {
    setData(prev => {
      storeAPI.updateClient(clientId, 'esculpeDetox', { [field]: checked });
      return { ...prev, [field]: checked };
    });
  }, [clientId]);

  const p = (field) => ({ value: data[field] ?? '', onChange: handleChange, onBlur: handleBlur, field });
  const t = (field, rows) => ({ value: data[field] ?? '', onChange: handleChange, onBlur: handleBlur, field, rows });

  return (
    <div className="animate-fade-in">
      <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Método Esculpe Detox</h2>

      <SectionTitle>Informações Pessoais</SectionTitle>
      <div className="grid grid-cols-3 mb-6">
        <Input label="Nome" {...p('nome')} />
        <Input label="Data de Nascimento" type="date" {...p('data_nasc')} />
        <Input label="Idade" type="number" {...p('idade')} />
        <Input label="E-mail" type="email" {...p('email')} />
        <Input label="Instagram" {...p('instagram')} />
        <Input label="Contato" {...p('contato')} />
        <Input label="Profissão" {...p('profissao')} />
        <Input label="Estado Civil" {...p('estado_civil')} />
        <Input label="Filhos" {...p('filhos')} />
        <Input label="Endereço" {...p('endereco')} />
        <Input label="Cidade" {...p('cidade')} />
        <Input label="Estado" {...p('estado')} />
        <Input label="CEP" {...p('cep')} />
        <Input label="Complemento" {...p('complemento')} />
      </div>
      <div className="grid grid-cols-2 mb-6">
        <RadioGroup label="Como nos conheceu?" field="como_conheceu" options={['Facebook', 'Instagram', 'Indicação', 'Outro']} value={data.como_conheceu} onChange={handleRadio} />
        <div className="form-group">
          <label style={{ fontWeight: 600 }}>Conhece alguém que já fez Esculpe Detox?</label>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
            <label className="checkbox-label">
              <input type="radio" name="conhece_alguem" value="sim" checked={data.conhece_alguem === 'sim'} onChange={() => handleRadio('conhece_alguem', 'sim')} /> Sim
            </label>
            <label className="checkbox-label">
              <input type="radio" name="conhece_alguem" value="não" checked={data.conhece_alguem === 'não'} onChange={() => handleRadio('conhece_alguem', 'não')} /> Não
            </label>
          </div>
          {data.conhece_alguem === 'sim' && (
            <input type="text" placeholder="Quem?" value={data.conhece_alguem_quem || ''} onChange={(e) => handleChange('conhece_alguem_quem', e.target.value)} onBlur={() => handleBlur('conhece_alguem_quem')} />
          )}
        </div>
      </div>

      <SectionTitle>Informações Gerais</SectionTitle>
      <div className="mb-6">
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Já fez tratamentos estéticos anteriormente?</label>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
            <label className="checkbox-label">
              <input type="radio" name="trat_ant" value="sim" checked={data.trat_ant === 'sim'} onChange={() => handleRadio('trat_ant', 'sim')} /> Sim
            </label>
            <label className="checkbox-label">
              <input type="radio" name="trat_ant" value="não" checked={data.trat_ant === 'não'} onChange={() => handleRadio('trat_ant', 'não')} /> Não
            </label>
          </div>
          {data.trat_ant === 'sim' && (
            <input type="text" placeholder="Qual(is) já fez?" value={data.trat_ant_quais || ''} onChange={(e) => handleChange('trat_ant_quais', e.target.value)} onBlur={() => handleBlur('trat_ant_quais')} />
          )}
        </div>
        <CheckboxGroup label="Protocolos de interesse" field="protocolos_interesse" options={protocolosOptions} value={data.protocolos_interesse} onToggle={handleToggle} />
      </div>

      <SectionTitle>Anamnese Comportamental</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <RadioGroup label="Sono" field="sono" options={['Menos de 6 horas de sono de qualidade', '6 horas de sono sem qualidade', '8 horas ou mais de sono de qualidade']} value={data.sono} onChange={handleRadio} />
        <RadioGroup label="Funcionamento do intestino" field="intestino" options={['Todos os dias', '3x ou mais na semana', '1x na semana']} value={data.intestino} onChange={handleRadio} />
        <RadioGroup label="Retenção de líquidos - urinar" field="urina" options={['2x ao dia', 'Mais de 2x ao dia', 'Mais de 5x ao dia']} value={data.urina} onChange={handleRadio} />
      </div>

      <SectionTitle>Hábitos Alimentares</SectionTitle>
      <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', marginBottom: '1rem' }}>
        Escala: 1 = Não consumo | 2 = Consumo raramente | 3 = Consumo regularmente | 4 = Consumo diariamente
      </p>
      <div className="grid grid-cols-3 mb-6">
        {habitosAlimentaresOptions.map(item => {
          const key = `hab_${item.toLowerCase().replace(/ /g, '_')}`;
          return (
            <div key={item} className="form-group">
              <label>{item}</label>
              <select value={data[key] || ''} onChange={(e) => { handleChange(key, e.target.value); handleBlur(key); }}>
                <option value="">-</option>
                <option value="1">1 - Não consumo</option>
                <option value="2">2 - Raramente</option>
                <option value="3">3 - Regularmente</option>
                <option value="4">4 - Diariamente</option>
              </select>
            </div>
          );
        })}
      </div>

      <SectionTitle>Líquidos</SectionTitle>
      <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', marginBottom: '1rem' }}>
        Escala: 1 = Não consumo | 2 = Consumo raramente | 3 = Consumo regularmente | 4 = Consumo diariamente
      </p>
      <div className="grid grid-cols-3 mb-6">
        {liquidosOptions.map(item => {
          const key = `liq_${item.toLowerCase().replace(/ /g, '_')}`;
          return (
            <div key={item} className="form-group">
              <label>{item}</label>
              <select value={data[key] || ''} onChange={(e) => { handleChange(key, e.target.value); handleBlur(key); }}>
                <option value="">-</option>
                <option value="1">1 - Não consumo</option>
                <option value="2">2 - Raramente</option>
                <option value="3">3 - Regularmente</option>
                <option value="4">4 - Diariamente</option>
              </select>
            </div>
          );
        })}
        <Input label="Quantidade de água diária" {...p('agua_quantidade')} />
      </div>

      <SectionTitle>Atividade Física</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <RadioGroup label="Prática atual" field="atividade_fisica" options={['Nunca praticou', 'Não pratica atualmente', 'Pratica regularmente']} value={data.atividade_fisica} onChange={handleRadio} />
        <Input label="Quais atividades?" {...p('atividade_quais')} />
        <Input label="Quantas vezes na semana?" {...p('atividade_frequencia')} />
      </div>

      <SectionTitle>Histórico Diário — Peso</SectionTitle>
      <div className="grid grid-cols-3 mb-6">
        <Input label="Peso atual" type="number" {...p('peso_atual')} />
        <Input label="Peso ideal" type="number" {...p('peso_ideal')} />
        <Input label="Idade atual" type="number" {...p('idade_atual')} />
        <Input label="Com quantos anos estava na melhor versão?" type="number" {...p('idade_melhor')} />
        <Textarea label="O que mudou desde esse período?" {...t('o_que_mudou', 2)} />
        <Textarea label="Com quem mora hoje?" {...t('com_quem_mora', 2)} />
        <Textarea label="Como é o seu trabalho?" {...t('trabalho', 2)} />
        <Textarea label="O que pode resgatar?" {...t('resgatar', 2)} />
        <Textarea label="O que precisa deixar?" {...t('deixar', 2)} />
        <Textarea label="O que tem deixado de fazer que antes te realizava?" {...t('deixou_fazer', 2)} />
        <Textarea label="Meta de transformação" {...t('meta_transformacao', 2)} />
      </div>

      <SectionTitle>Referência de Bem-Estar e Estética</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <Input label="Qual idade tinha?" type="number" {...p('ref_idade')} />
        <Textarea label="Com quem morava?" {...t('ref_com_quem', 2)} />
        <Textarea label="Como era a sua rotina?" {...t('ref_rotina', 2)} />
        <Textarea label="O que mais gostava de fazer?" {...t('ref_gostava', 2)} />
      </div>

      <SectionTitle>Métodos Contraceptivos</SectionTitle>
      <CheckboxGroup label="Assinale a opção em uso ou a última que usou" field="contraceptivos" options={contraceptivosOptions} value={data.contraceptivos} onToggle={handleToggle} />

      <SectionTitle>Acompanhamento Contínuo</SectionTitle>
      <CheckboxGroup label="Está a ser acompanhada por algum especialista?" field="acompanhamento" options={acompanhamentoOptions} value={data.acompanhamento} onToggle={handleToggle} />

      <SectionTitle>Medicação Contínua / Cirurgia</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <Textarea label="Medicação contínua" {...t('medicacao', 2)} />
        <Textarea label="Cirurgia (histórico)" {...t('cirurgia', 2)} />
      </div>

      <SectionTitle>Avaliação Funcional — Área 1: Stresse</SectionTitle>
      <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', marginBottom: '1rem' }}>Assinale as opções positivas (cada opção vale 1 ponto)</p>
      <div className="grid grid-cols-2 mb-2">
        {[['est_surtos_fome','Surtos de fome'],['est_fadiga','Fadiga constante'],['est_humor','Alteração de humor'],['est_imunidade','Baixa imunidade'],['est_ansiedade','Ansiedade'],['est_pele','Irritações na pele'],['est_doces','Desejo de comer doces'],['est_sono','Distúrbio do sono'],['est_depressao','Depressão'],['est_pensamento','Pensamento acelerado']].map(([f,l]) => (
          <ScoreField key={f} label={l} field={f} checked={!!data[f]} onChange={handleCheck} />
        ))}
      </div>
      <div className="form-group" style={{ marginTop: '0.5rem' }}>
        <label style={{ fontWeight: 700 }}>Pontuação Total</label>
        <input type="number" min="0" value={data.score_stress || ''} onChange={(e) => handleChange('score_stress', e.target.value)} onBlur={() => handleBlur('score_stress')} style={{ maxWidth: '100px' }} />
      </div>

      <SectionTitle marginTop>Avaliação Funcional — Área 1: Hormonas</SectionTitle>
      <div className="grid grid-cols-2 mb-2">
        {[['hor_cansado','Se sente cansado o tempo todo'],['hor_irritado','Está irritado e mau humorado'],['hor_sono_cansaco','O sono deixa com sensação de cansaço'],['hor_tarde','Sente-se esgotado no meio da tarde'],['hor_mal','Às vezes sente-se mal sem razão aparente'],['hor_menstruacao','Menstruação irregular'],['hor_colicas','Sofre com cólicas'],['hor_retencao','Retém muito líquido durante a menstruação'],['hor_doces','Vontade de comer doces na menstruação'],['hor_ansiosa','Irritada/intolerante/ansiosa na menstruação']].map(([f,l]) => (
          <ScoreField key={f} label={l} field={f} checked={!!data[f]} onChange={handleCheck} />
        ))}
      </div>
      <div className="form-group" style={{ marginTop: '0.5rem' }}>
        <label style={{ fontWeight: 700 }}>Pontuação Total</label>
        <input type="number" min="0" value={data.score_hormonas || ''} onChange={(e) => handleChange('score_hormonas', e.target.value)} onBlur={() => handleBlur('score_hormonas')} style={{ maxWidth: '100px' }} />
      </div>

      <SectionTitle marginTop>Avaliação Funcional — Área 2: Digestão</SectionTitle>
      <div className="grid grid-cols-2 mb-2">
        {[['dig_estufado','Sente-se estufado logo após comer'],['dig_gases','Gases frequentes pós-refeições'],['dig_colicas','Cólicas abdominais frequentes'],['dig_prisao','Prisão de ventre'],['dig_candida','Cândida crónica'],['dig_diarreia','Diarreia'],['dig_azia','Azia / Má digestão'],['dig_hemorroidas','Hemorroidas'],['dig_cabeca','Dor de cabeça'],['dig_unhas','Unhas fracas']].map(([f,l]) => (
          <ScoreField key={f} label={l} field={f} checked={!!data[f]} onChange={handleCheck} />
        ))}
      </div>
      <div className="form-group" style={{ marginTop: '0.5rem' }}>
        <label style={{ fontWeight: 700 }}>Pontuação Total</label>
        <input type="number" min="0" value={data.score_digestao || ''} onChange={(e) => handleChange('score_digestao', e.target.value)} onBlur={() => handleBlur('score_digestao')} style={{ maxWidth: '100px' }} />
      </div>

      <SectionTitle marginTop>Avaliação Funcional — Área 2: Inflamação</SectionTitle>
      <div className="grid grid-cols-2 mb-2">
        {[['inf_articulacoes','Dores nas articulações'],['inf_inchaco','Inchaço nas articulações'],['inf_costas','Dor no pescoço, ombros e/ou costas'],['inf_remedios','Toma muitos remédios para dor'],['inf_pior','Está sempre à espera do pior'],['inf_doces','Vontade de comer doces'],['inf_rinite','Rinite alérgica'],['inf_cabeca','Dores de cabeça com frequência'],['inf_pele','Problemas de pele'],['inf_intestino','Problemas de intestino']].map(([f,l]) => (
          <ScoreField key={f} label={l} field={f} checked={!!data[f]} onChange={handleCheck} />
        ))}
      </div>
      <div className="form-group" style={{ marginTop: '0.5rem' }}>
        <label style={{ fontWeight: 700 }}>Pontuação Total</label>
        <input type="number" min="0" value={data.score_inflamacao || ''} onChange={(e) => handleChange('score_inflamacao', e.target.value)} onBlur={() => handleBlur('score_inflamacao')} style={{ maxWidth: '100px' }} />
      </div>

      <SectionTitle marginTop>Avaliação Funcional — Área 3: Circulação</SectionTitle>
      <div className="grid grid-cols-2 mb-2">
        {[['cir_palpitacoes','Sofre com palpitações'],['cir_ar','Fica sem ar ao subir escadas'],['cir_formigamento','Formigamento nas mãos ou pés'],['cir_sal','Põe sal em excesso nos alimentos'],['cir_fumante','É fumante'],['cir_sede','Sente muita sede'],['cir_urina','Urina muito'],['cir_cansado','Está sempre cansado'],['cir_pressao','Tem ou já teve pressão alta'],['cir_stress','Sente-se muito stressado']].map(([f,l]) => (
          <ScoreField key={f} label={l} field={f} checked={!!data[f]} onChange={handleCheck} />
        ))}
      </div>
      <div className="form-group" style={{ marginTop: '0.5rem' }}>
        <label style={{ fontWeight: 700 }}>Pontuação Total</label>
        <input type="number" min="0" value={data.score_circulacao || ''} onChange={(e) => handleChange('score_circulacao', e.target.value)} onBlur={() => handleBlur('score_circulacao')} style={{ maxWidth: '100px' }} />
      </div>

      <SectionTitle marginTop>Avaliação Funcional — Área 3: Energia</SectionTitle>
      <div className="grid grid-cols-2 mb-2">
        {[['ene_sono','Precisa de mais horas de sono'],['ene_preguica','Sente-se pesado e com preguiça pela manhã'],['ene_cafe','Toma muito chá ou café durante o dia'],['ene_acucar','Vontade de comer açúcar e/ou carboidrato'],['ene_exercicio','Evita exercitar-se por estar cansado'],['ene_concentracao','Perde a concentração com frequência'],['ene_stress','Sente-se muito stressado'],['ene_sentado','Fica muito tempo sentado'],['ene_pernas','Sente as pernas pesadas'],['ene_peso','Está mais de 10 kg acima do peso']].map(([f,l]) => (
          <ScoreField key={f} label={l} field={f} checked={!!data[f]} onChange={handleCheck} />
        ))}
      </div>
      <div className="form-group" style={{ marginTop: '0.5rem' }}>
        <label style={{ fontWeight: 700 }}>Pontuação Total</label>
        <input type="number" min="0" value={data.score_energia || ''} onChange={(e) => handleChange('score_energia', e.target.value)} onBlur={() => handleBlur('score_energia')} style={{ maxWidth: '100px' }} />
      </div>

      <SectionTitle marginTop>Avaliação Funcional — Área 3: Imunológico</SectionTitle>
      <div className="grid grid-cols-2 mb-2">
        {[['imu_resfriado','Pega resfriado com frequência'],['imu_demora','Demora para restabelecer-se quando adoece'],['imu_stress','É comum sentir-se stressado'],['imu_dep','Sofre com depressão ou ansiedade'],['imu_antibioticos','Usou antibióticos mais de 1x no último ano'],['imu_garganta','Tem dores de garganta'],['imu_cabeca','Dores de cabeça frequentes'],['imu_intestino','Problemas de intestino'],['imu_alergia','Alérgico a algum alimento'],['imu_alcool','Consome bebidas alcoólicas mais de 3x na semana']].map(([f,l]) => (
          <ScoreField key={f} label={l} field={f} checked={!!data[f]} onChange={handleCheck} />
        ))}
      </div>
      <div className="form-group" style={{ marginTop: '0.5rem' }}>
        <label style={{ fontWeight: 700 }}>Pontuação Total</label>
        <input type="number" min="0" value={data.score_imunologico || ''} onChange={(e) => handleChange('score_imunologico', e.target.value)} onBlur={() => handleBlur('score_imunologico')} style={{ maxWidth: '100px' }} />
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--clr-sidebar)', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)', fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>
        <strong>Legenda:</strong> De 7 a 10 = Prioridade!! | De 4 a 6 = Atenção! | De 1 a 3 = Normal.
      </div>

      <SectionTitle marginTop>Ficha de Acompanhamento — Sessões</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <Input label="Tratamento 1 — Data de início" type="date" {...p('trat1_data')} />
        <Input label="Nº de sessões (Tratamento 1)" type="number" {...p('trat1_nsessoes')} />
        <CheckboxGroup label="Tipo de tratamento 1" field="trat1_tipo" options={protocolosOptions} value={data.trat1_tipo} onToggle={handleToggle} />
        <Input label="Tratamento 2 — Data de início" type="date" {...p('trat2_data')} />
        <Input label="Nº de sessões (Tratamento 2)" type="number" {...p('trat2_nsessoes')} />
        <CheckboxGroup label="Tipo de tratamento 2" field="trat2_tipo" options={protocolosOptions} value={data.trat2_tipo} onToggle={handleToggle} />
      </div>

      <SectionTitle>Massagem Avaliativa</SectionTitle>

      {/* Termómetro de Desconforto + Peso lado a lado */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Termómetro */}
        <div style={{ border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{ background: 'var(--clr-primary)', color: '#fff', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.875rem' }}>
            TERMÓMETRO DE DESCONFORTO <span style={{ fontWeight: 400, fontSize: '0.75rem' }}>(escala 0 a 10)</span>
          </div>
          <div style={{ padding: '0.75rem', fontSize: '0.8rem' }}>
            {[
              { label: 'Área 1 – Superior', fields: [['term_sup_inicio','Início da massagem'],['term_sup_final','Final da massagem']] },
              { label: 'Área 2 – Central', fields: [], sub: [
                { sublabel: 'REGIÃO DE FÍGADO', fields: [['term_figado_inicio','Início da massagem'],['term_figado_final','Final da massagem']] },
                { sublabel: 'REGIÃO DE BAÇO', fields: [['term_baco_inicio','Início da massagem'],['term_baco_final','Final da massagem']] },
                { sublabel: 'REGIÃO DE INTESTINO', fields: [['term_intestino_inicio','Início da massagem'],['term_intestino_final','Final da massagem']] },
              ]},
              { label: 'Área 3 – Inferior', fields: [], sub: [
                { sublabel: 'REGIÃO DE VIRILHA', fields: [['term_virilha_inicio','Início da massagem'],['term_virilha_final','Final da massagem']] },
                { sublabel: 'INFERIOR DE PERNA', fields: [['term_perna_inicio','Início da massagem'],['term_perna_final','Final da massagem']] },
              ]},
            ].map((area) => (
              <div key={area.label} style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--clr-primary)', marginBottom: '0.25rem' }}>{area.label}</div>
                {area.fields.map(([f, lbl]) => (
                  <div key={f} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span style={{ color: 'var(--clr-text-muted)' }}>{lbl}</span>
                    <input type="number" min="0" max="10" value={data[f] || ''} onChange={(e) => handleChange(f, e.target.value)} onBlur={() => handleBlur(f)} style={{ width: '60px', padding: '2px 4px', fontSize: '0.8rem' }} />
                  </div>
                ))}
                {(area.sub || []).map(s => (
                  <div key={s.sublabel} style={{ marginLeft: '0.5rem', marginBottom: '0.4rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--clr-text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{s.sublabel}</div>
                    {s.fields.map(([f, lbl]) => (
                      <div key={f} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <span style={{ color: 'var(--clr-text-muted)' }}>{lbl}</span>
                        <input type="number" min="0" max="10" value={data[f] || ''} onChange={(e) => handleChange(f, e.target.value)} onBlur={() => handleBlur(f)} style={{ width: '60px', padding: '2px 4px', fontSize: '0.8rem' }} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Peso */}
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', padding: '0.4rem 0.75rem', background: 'var(--clr-sidebar)', borderRadius: 'var(--radius-sm)', display: 'inline-block' }}>PESO</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr>
                <th style={maTh}></th>
                <th style={{ ...maTh, textAlign: 'center' }} colSpan={3}>1º Tratamento</th>
                <th style={{ ...maTh, textAlign: 'center' }} colSpan={3}>2º Tratamento</th>
              </tr>
              <tr>
                <th style={maTh}></th>
                {['Início','Meio','Final','Início','Meio','Final'].map((h,i) => <th key={i} style={maTh}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={maTd}>Data</td>
                {['mass1_data_inicio','mass1_data_meio','mass1_data_final','mass2_data_inicio','mass2_data_meio','mass2_data_final'].map(f => (
                  <td key={f} style={maTd}>
                    <input type="date" value={data[f] || ''} onChange={(e) => handleChange(f, e.target.value)} onBlur={() => handleBlur(f)} style={{ width: '100%', fontSize: '0.7rem', padding: '1px', border: 'none', background: 'transparent' }} />
                  </td>
                ))}
              </tr>
              <tr>
                <td style={maTd}>Peso</td>
                {['mass1_peso_inicio','mass1_peso_meio','mass1_peso_final','mass2_peso_inicio','mass2_peso_meio','mass2_peso_final'].map(f => (
                  <td key={f} style={maTd}>
                    <input type="number" value={data[f] || ''} onChange={(e) => handleChange(f, e.target.value)} onBlur={() => handleBlur(f)} style={{ width: '100%', fontSize: '0.8rem', padding: '2px', border: 'none', background: 'transparent' }} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Área 1 */}
      <div style={{ border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', overflow: 'hidden' }}>
        <div style={{ background: 'var(--clr-primary)', color: '#fff', padding: '0.4rem 1rem', fontWeight: 700, fontSize: '0.875rem' }}>ÁREA 1</div>
        <div style={{ padding: '0.75rem' }}>
          <MedidaAreaTable prefix="area1" alturas={5} data={data} handleChange={handleChange} handleBlur={handleBlur} />
        </div>
      </div>

      {/* Área 2 */}
      <div style={{ border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', overflow: 'hidden' }}>
        <div style={{ background: 'var(--clr-primary)', color: '#fff', padding: '0.4rem 1rem', fontWeight: 700, fontSize: '0.875rem' }}>ÁREA 2</div>
        <div style={{ padding: '0.75rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.4rem' }}>DIREITO</div>
          <MedidaAreaTable prefix="area2_dir" alturas={3} data={data} handleChange={handleChange} handleBlur={handleBlur} />
          <div style={{ fontWeight: 600, fontSize: '0.8rem', margin: '0.75rem 0 0.4rem' }}>ESQUERDO</div>
          <MedidaAreaTable prefix="area2_esq" alturas={3} data={data} handleChange={handleChange} handleBlur={handleBlur} />
        </div>
      </div>

      {/* Área 3 */}
      <div style={{ border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', overflow: 'hidden' }}>
        <div style={{ background: 'var(--clr-primary)', color: '#fff', padding: '0.4rem 1rem', fontWeight: 700, fontSize: '0.875rem' }}>ÁREA 3</div>
        <div style={{ padding: '0.75rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.4rem' }}>DIREITO</div>
          <MedidaAreaTable prefix="area3_dir" alturas={4} data={data} handleChange={handleChange} handleBlur={handleBlur} />
          <div style={{ fontWeight: 600, fontSize: '0.8rem', margin: '0.75rem 0 0.4rem' }}>ESQUERDO</div>
          <MedidaAreaTable prefix="area3_esq" alturas={4} data={data} handleChange={handleChange} handleBlur={handleBlur} />
        </div>
      </div>

      <SectionTitle>Dados de Bioimpedância (Opcional)</SectionTitle>
      <div className="grid grid-cols-3 mb-6">
        <Input label="Índice de massa gorda" {...p('bio_massa_gorda')} />
        <Input label="Índice de massa magra" {...p('bio_massa_magra')} />
        <Input label="Massa muscular" {...p('bio_muscular')} />
      </div>

      <SectionTitle>Pontos Importantes / Orientações</SectionTitle>
      <div className="grid grid-cols-1 mb-6">
        <Textarea label="Pontos importantes da avaliação" {...t('pontos_importantes', 4)} />
        <Textarea label="Sugestão de profissionais ou outros realizados na consulta" {...t('sugestao_profissionais', 3)} />
        <Textarea label="Orientações sobre mudanças de hábito" {...t('orientacoes_habito', 3)} />
      </div>

      <div style={{ padding: '1.5rem', background: 'var(--clr-sidebar)', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-primary)' }}>
        <label className="checkbox-label" style={{ fontWeight: 600 }}>
          <input type="checkbox" checked={!!data.termo_aceito} onChange={(e) => handleCheck('termo_aceito', e.target.checked)} />
          Declaro que as afirmações acima são verdadeiras. Li e aceito os termos de responsabilidade.
        </label>
      </div>
    </div>
  );
}
