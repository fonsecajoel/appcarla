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

const maTh = { border: '1px solid var(--clr-border)', padding: '4px 6px', background: 'var(--clr-sidebar)', fontSize: '0.75rem', fontWeight: 600, textAlign: 'left' };
const maTd = { border: '1px solid var(--clr-border)', padding: '3px 6px', fontSize: '0.78rem' };

const MedidaAreaTable = ({ prefix, alturas, data, handleChange, handleBlur }) => {
  const rows = Array.from({ length: alturas }, (_, i) => i + 1);
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr>
          <th style={maTh}>Altura</th>
          <th style={{ ...maTh, textAlign: 'center' }} colSpan={3}>1º Tratamento</th>
          <th style={{ ...maTh, textAlign: 'center' }} colSpan={3}>2º Tratamento</th>
        </tr>
        <tr>
          <th style={maTh}></th>
          {['Início','Meio','Final','Início','Meio','Final'].map((h, i) => <th key={i} style={maTh}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map(n => {
          const fields = [
            `${prefix}_h${n}_t1_inicio`, `${prefix}_h${n}_t1_meio`, `${prefix}_h${n}_t1_final`,
            `${prefix}_h${n}_t2_inicio`, `${prefix}_h${n}_t2_meio`, `${prefix}_h${n}_t2_final`,
          ];
          return (
            <tr key={n}>
              <td style={maTd}>{n}</td>
              {fields.map(f => (
                <td key={f} style={maTd}>
                  <input
                    type="number"
                    value={data[f] || ''}
                    onChange={(e) => handleChange(f, e.target.value)}
                    onBlur={() => handleBlur(f)}
                    style={{ width: '100%', fontSize: '0.78rem', padding: '2px', border: 'none', background: 'transparent' }}
                  />
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

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

      {/* ═══════════════════════════════════════════════════════
          MASSAGEM AVALIATIVA — layout fiel ao documento original
          ═══════════════════════════════════════════════════════ */}
      <div style={{ border: '2px solid var(--clr-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem', background: 'var(--clr-bg)' }}>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--clr-primary)', color: '#fff', borderRadius: '4px', padding: '4px 10px', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em' }}>ESCULPE<br/><span style={{ fontWeight: 400, fontSize: '0.65rem' }}>detox</span></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--clr-text-main)', lineHeight: 1 }}>Massagem Avaliativa</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Método Esculpe Detox</div>
          </div>
        </div>

        {/* Corpo + Termómetro */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>

          {/* Corpo humano SVG — frente e costas com pontos */}
          <div style={{ flex: 1, position: 'relative' }}>
            <svg viewBox="0 0 340 380" style={{ width: '100%', maxWidth: '420px' }} xmlns="http://www.w3.org/2000/svg">
              {/* === FIGURA DA FRENTE === */}
              {/* Cabeça */}
              <ellipse cx="85" cy="28" rx="18" ry="22" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              {/* Cabelo */}
              <ellipse cx="85" cy="18" rx="18" ry="14" fill="#8B5E3C"/>
              <ellipse cx="67" cy="28" rx="5" ry="12" fill="#8B5E3C"/>
              <ellipse cx="103" cy="28" rx="5" ry="12" fill="#8B5E3C"/>
              {/* Pescoço */}
              <rect x="80" y="48" width="10" height="12" fill="#e8c9a0"/>
              {/* Tronco */}
              <path d="M62 60 Q85 56 108 60 L112 130 Q85 135 58 130 Z" fill="#d4956a" stroke="#c8a882" strokeWidth="1"/>
              {/* Biquíni top */}
              <path d="M68 75 Q85 80 102 75 L104 88 Q85 93 66 88 Z" fill="#7b9e87" stroke="#5a7a68" strokeWidth="1"/>
              {/* Braço esquerdo */}
              <path d="M62 62 Q48 80 44 110 Q46 115 52 115 Q54 85 68 68 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              {/* Mão esquerda */}
              <ellipse cx="48" cy="118" rx="6" ry="8" fill="#e8c9a0"/>
              {/* Braço direito */}
              <path d="M108 62 Q122 80 126 110 Q124 115 118 115 Q116 85 102 68 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              {/* Mão direita */}
              <ellipse cx="122" cy="118" rx="6" ry="8" fill="#e8c9a0"/>
              {/* Abdómen */}
              <path d="M63 130 Q85 135 107 130 L110 185 Q85 190 60 185 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              {/* Biquíni baixo */}
              <path d="M62 170 Q85 165 108 170 L110 185 Q85 192 60 185 Z" fill="#7b9e87" stroke="#5a7a68" strokeWidth="1"/>
              {/* Coxas */}
              <path d="M63 185 Q72 183 78 185 L80 255 Q73 257 66 255 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <path d="M92 185 Q98 183 107 185 L104 255 Q97 257 90 255 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              {/* Joelhos */}
              <ellipse cx="73" cy="257" rx="9" ry="7" fill="#d4a882"/>
              <ellipse cx="97" cy="257" rx="9" ry="7" fill="#d4a882"/>
              {/* Pernas */}
              <path d="M64 262 Q72 260 79 262 L78 330 Q72 332 65 330 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <path d="M91 262 Q98 260 106 262 L105 330 Q99 332 92 330 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              {/* Pés */}
              <ellipse cx="72" cy="333" rx="10" ry="5" fill="#d4a882"/>
              <ellipse cx="98" cy="333" rx="10" ry="5" fill="#d4a882"/>

              {/* === FIGURA DE COSTAS === */}
              {/* Cabeça costas */}
              <ellipse cx="250" cy="28" rx="18" ry="22" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <ellipse cx="250" cy="18" rx="18" ry="14" fill="#8B5E3C"/>
              <ellipse cx="232" cy="28" rx="5" ry="12" fill="#8B5E3C"/>
              <ellipse cx="268" cy="28" rx="5" ry="12" fill="#8B5E3C"/>
              {/* Pescoço costas */}
              <rect x="245" y="48" width="10" height="12" fill="#e8c9a0"/>
              {/* Tronco costas */}
              <path d="M227 60 Q250 56 273 60 L277 130 Q250 135 223 130 Z" fill="#d4956a" stroke="#c8a882" strokeWidth="1"/>
              {/* Topo biquíni costas */}
              <path d="M230 72 Q250 68 270 72 L270 76 Q250 80 230 76 Z" fill="#7b9e87" stroke="#5a7a68" strokeWidth="1"/>
              {/* Braço esquerdo costas */}
              <path d="M227 62 Q213 80 209 110 Q211 115 217 115 Q219 85 233 68 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <ellipse cx="213" cy="118" rx="6" ry="8" fill="#e8c9a0"/>
              {/* Braço direito costas */}
              <path d="M273 62 Q287 80 291 110 Q289 115 283 115 Q281 85 267 68 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <ellipse cx="287" cy="118" rx="6" ry="8" fill="#e8c9a0"/>
              {/* Costas / lombar */}
              <path d="M228 130 Q250 135 272 130 L275 185 Q250 190 225 185 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              {/* Biquíni baixo costas */}
              <path d="M228 170 Q250 165 272 170 L274 185 Q250 192 226 185 Z" fill="#7b9e87" stroke="#5a7a68" strokeWidth="1"/>
              {/* Coxas costas */}
              <path d="M228 185 Q237 183 243 185 L245 255 Q238 257 231 255 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <path d="M257 185 Q263 183 272 185 L269 255 Q262 257 255 255 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <ellipse cx="238" cy="257" rx="9" ry="7" fill="#d4a882"/>
              <ellipse cx="262" cy="257" rx="9" ry="7" fill="#d4a882"/>
              {/* Pernas costas */}
              <path d="M229 262 Q237 260 244 262 L243 330 Q237 332 230 330 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <path d="M256 262 Q263 260 271 262 L270 330 Q264 332 257 330 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <ellipse cx="237" cy="333" rx="10" ry="5" fill="#d4a882"/>
              <ellipse cx="263" cy="333" rx="10" ry="5" fill="#d4a882"/>

              {/* === LABELS FRENTE === */}
              <line x1="62" y1="68" x2="20" y2="78" stroke="#555" strokeWidth="0.8"/>
              <text x="2" y="81" fontSize="7" fill="#333" fontWeight="600">Axilas</text>

              <line x1="74" y1="58" x2="20" y2="105" stroke="#555" strokeWidth="0.8"/>
              <text x="2" y="108" fontSize="7" fill="#333" fontWeight="600">Colo</text>

              <line x1="68" y1="105" x2="20" y2="122" stroke="#555" strokeWidth="0.8"/>
              <text x="2" y="125" fontSize="7" fill="#333" fontWeight="600">Abdómen superior</text>

              <line x1="65" y1="130" x2="20" y2="140" stroke="#555" strokeWidth="0.8"/>
              <text x="2" y="143" fontSize="7" fill="#333" fontWeight="600">Flancos</text>

              <line x1="66" y1="148" x2="20" y2="158" stroke="#555" strokeWidth="0.8"/>
              <text x="2" y="161" fontSize="7" fill="#333" fontWeight="600">Abdómen inferior</text>

              <line x1="70" y1="178" x2="20" y2="178" stroke="#555" strokeWidth="0.8"/>
              <text x="2" y="181" fontSize="7" fill="#333" fontWeight="600">Culote</text>

              <line x1="68" y1="210" x2="20" y2="215" stroke="#555" strokeWidth="0.8"/>
              <text x="2" y="218" fontSize="7" fill="#333" fontWeight="600">Interior de perna</text>

              <line x1="72" y1="255" x2="20" y2="255" stroke="#555" strokeWidth="0.8"/>
              <text x="2" y="258" fontSize="7" fill="#333" fontWeight="600">Interior de joelhos</text>

              {/* === LABELS COSTAS === */}
              <line x1="273" y1="88" x2="316" y2="78" stroke="#555" strokeWidth="0.8"/>
              <text x="318" y="81" fontSize="7" fill="#333" fontWeight="600">Dorso superior</text>

              <line x1="268" y1="115" x2="316" y2="110" stroke="#555" strokeWidth="0.8"/>
              <text x="318" y="113" fontSize="7" fill="#333" fontWeight="600">Posterior de braço</text>

              <line x1="273" y1="145" x2="316" y2="145" stroke="#555" strokeWidth="0.8"/>
              <text x="318" y="148" fontSize="7" fill="#333" fontWeight="600">Dorso inferior</text>

              <line x1="269" y1="195" x2="316" y2="195" stroke="#555" strokeWidth="0.8"/>
              <text x="318" y="198" fontSize="7" fill="#333" fontWeight="600">Sub-glútea</text>

              {/* === PONTOS COLORIDOS FRENTE === */}
              {/* Axila esq */}
              <circle cx="62" cy="68" r="5" fill="#e57373" stroke="#fff" strokeWidth="1"/>
              {/* Colo */}
              <circle cx="85" cy="62" r="5" fill="#e57373" stroke="#fff" strokeWidth="1"/>
              {/* Abdómen superior */}
              <circle cx="85" cy="100" r="5" fill="#e57373" stroke="#fff" strokeWidth="1"/>
              {/* Flancos esq */}
              <circle cx="63" cy="130" r="5" fill="#81c784" stroke="#fff" strokeWidth="1"/>
              {/* Flancos dir */}
              <circle cx="107" cy="130" r="5" fill="#81c784" stroke="#fff" strokeWidth="1"/>
              {/* Abdómen inferior */}
              <circle cx="85" cy="150" r="5" fill="#e57373" stroke="#fff" strokeWidth="1"/>
              {/* Culote esq */}
              <circle cx="66" cy="178" r="5" fill="#ffb74d" stroke="#fff" strokeWidth="1"/>
              {/* Culote dir */}
              <circle cx="104" cy="178" r="5" fill="#ffb74d" stroke="#fff" strokeWidth="1"/>
              {/* Interior perna esq */}
              <circle cx="70" cy="210" r="5" fill="#4fc3f7" stroke="#fff" strokeWidth="1"/>
              {/* Interior joelhos */}
              <circle cx="73" cy="255" r="5" fill="#4fc3f7" stroke="#fff" strokeWidth="1"/>

              {/* === PONTOS COLORIDOS COSTAS === */}
              {/* Dorso superior */}
              <circle cx="250" cy="88" r="5" fill="#e57373" stroke="#fff" strokeWidth="1"/>
              {/* Posterior braço esq */}
              <circle cx="215" cy="112" r="5" fill="#81c784" stroke="#fff" strokeWidth="1"/>
              {/* Posterior braço dir */}
              <circle cx="285" cy="112" r="5" fill="#81c784" stroke="#fff" strokeWidth="1"/>
              {/* Dorso inferior */}
              <circle cx="250" cy="145" r="5" fill="#e57373" stroke="#fff" strokeWidth="1"/>
              {/* Sub-glútea esq */}
              <circle cx="235" cy="192" r="5" fill="#ffb74d" stroke="#fff" strokeWidth="1"/>
              {/* Sub-glútea dir */}
              <circle cx="265" cy="192" r="5" fill="#ffb74d" stroke="#fff" strokeWidth="1"/>
            </svg>
          </div>

          {/* Termómetro de Desconforto */}
          <div style={{ width: '220px', flexShrink: 0 }}>
            <div style={{ background: '#5a8a7a', color: '#fff', padding: '0.4rem 0.6rem', fontWeight: 700, fontSize: '0.75rem', borderRadius: '4px 4px 0 0', textAlign: 'center' }}>
              TERMÓMETRO DE<br/>DESCONFORTO
            </div>
            <div style={{ border: '1px solid #5a8a7a', borderTop: 'none', borderRadius: '0 0 4px 4px', padding: '0.5rem 0.6rem', fontSize: '0.72rem' }}>
              <div style={{ color: 'var(--clr-text-muted)', marginBottom: '0.4rem', fontStyle: 'italic' }}>Na escala de 0 a 10</div>

              {/* Área 1 */}
              <div style={{ fontWeight: 700, color: 'var(--clr-primary)', marginBottom: '0.15rem' }}>Área 1 - Superior</div>
              {[['term_sup_inicio','Início da massagem'],['term_sup_final','Final da massagem']].map(([f,lbl]) => (
                <div key={f} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                  <span style={{ color: 'var(--clr-text-muted)' }}>{lbl}</span>
                  <input type="number" min="0" max="10" value={data[f]||''} onChange={e=>handleChange(f,e.target.value)} onBlur={()=>handleBlur(f)} style={{ width: '44px', padding: '1px 3px', fontSize: '0.72rem', textAlign: 'center' }} />
                </div>
              ))}

              {/* Área 2 Central */}
              <div style={{ fontWeight: 700, color: 'var(--clr-primary)', margin: '0.4rem 0 0.1rem' }}>Área 2 - Central</div>

              {[
                { sub: 'REGIÃO DE FÍGADO', fields: [['term_figado_inicio','Início da massagem'],['term_figado_final','Final da massagem']] },
                { sub: 'REGIÃO DE BAÇO', fields: [['term_baco_inicio','Início da massagem'],['term_baco_final','Final da massagem']] },
                { sub: 'REGIÃO DE INTESTINO', fields: [['term_intestino_inicio','Início da massagem'],['term_intestino_final','Final da massagem']] },
              ].map(({ sub, fields }) => (
                <div key={sub} style={{ marginBottom: '0.3rem' }}>
                  <div style={{ background: '#5a8a7a', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '1px 4px', marginBottom: '0.1rem' }}>{sub}</div>
                  {fields.map(([f,lbl]) => (
                    <div key={f} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.1rem' }}>
                      <span style={{ color: 'var(--clr-text-muted)' }}>{lbl}</span>
                      <input type="number" min="0" max="10" value={data[f]||''} onChange={e=>handleChange(f,e.target.value)} onBlur={()=>handleBlur(f)} style={{ width: '44px', padding: '1px 3px', fontSize: '0.72rem', textAlign: 'center' }} />
                    </div>
                  ))}
                </div>
              ))}

              {/* Área 3 Inferior */}
              <div style={{ fontWeight: 700, color: 'var(--clr-primary)', margin: '0.4rem 0 0.1rem' }}>Área 3 - Inferior</div>

              {[
                { sub: 'REGIÃO DE VIRILHA', fields: [['term_virilha_inicio','Início da massagem'],['term_virilha_final','Final da massagem']] },
                { sub: 'INFERIOR DE PERNA', fields: [['term_perna_inicio','Início da massagem'],['term_perna_final','Final da massagem']] },
              ].map(({ sub, fields }) => (
                <div key={sub} style={{ marginBottom: '0.3rem' }}>
                  <div style={{ background: '#5a8a7a', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '1px 4px', marginBottom: '0.1rem' }}>{sub}</div>
                  {fields.map(([f,lbl]) => (
                    <div key={f} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.1rem' }}>
                      <span style={{ color: 'var(--clr-text-muted)' }}>{lbl}</span>
                      <input type="number" min="0" max="10" value={data[f]||''} onChange={e=>handleChange(f,e.target.value)} onBlur={()=>handleBlur(f)} style={{ width: '44px', padding: '1px 3px', fontSize: '0.72rem', textAlign: 'center' }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PESO */}
        <div style={{ border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', overflow: 'hidden' }}>
          <div style={{ background: 'var(--clr-sidebar)', padding: '0.3rem 0.75rem', fontWeight: 700, fontSize: '0.85rem', borderBottom: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>⚖️</span> PESO
          </div>
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
                    <input type="date" value={data[f]||''} onChange={e=>handleChange(f,e.target.value)} onBlur={()=>handleBlur(f)} style={{ width: '100%', fontSize: '0.7rem', padding: '1px', border: 'none', background: 'transparent' }} />
                  </td>
                ))}
              </tr>
              <tr>
                <td style={maTd}>Peso</td>
                {['mass1_peso_inicio','mass1_peso_meio','mass1_peso_final','mass2_peso_inicio','mass2_peso_meio','mass2_peso_final'].map(f => (
                  <td key={f} style={maTd}>
                    <input type="number" value={data[f]||''} onChange={e=>handleChange(f,e.target.value)} onBlur={()=>handleBlur(f)} style={{ width: '100%', fontSize: '0.8rem', padding: '2px', border: 'none', background: 'transparent' }} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ÁREA 1 — com imagem miniatura lateral */}
        <div style={{ border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', overflow: 'hidden' }}>
          <div style={{ background: '#5a8a7a', color: '#fff', padding: '0.3rem 0.75rem', fontWeight: 700, fontSize: '0.82rem' }}>ÁREA 1</div>
          <div style={{ display: 'flex', gap: '0.75rem', padding: '0.6rem 0.75rem', alignItems: 'flex-start' }}>
            {/* Mini corpo Área 1 */}
            <svg viewBox="60 55 60 145" style={{ width: '60px', flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="85" cy="28" rx="18" ry="22" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <ellipse cx="85" cy="18" rx="18" ry="14" fill="#8B5E3C"/>
              <ellipse cx="67" cy="28" rx="5" ry="12" fill="#8B5E3C"/>
              <ellipse cx="103" cy="28" rx="5" ry="12" fill="#8B5E3C"/>
              <rect x="80" y="48" width="10" height="12" fill="#e8c9a0"/>
              <path d="M62 60 Q85 56 108 60 L112 130 Q85 135 58 130 Z" fill="#d4956a" stroke="#c8a882" strokeWidth="1"/>
              <path d="M68 75 Q85 80 102 75 L104 88 Q85 93 66 88 Z" fill="#7b9e87" stroke="#5a7a68" strokeWidth="1"/>
              <path d="M62 62 Q48 80 44 110 Q46 115 52 115 Q54 85 68 68 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <path d="M108 62 Q122 80 126 110 Q124 115 118 115 Q116 85 102 68 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <path d="M63 130 Q85 135 107 130 L110 185 Q85 190 60 185 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <path d="M62 170 Q85 165 108 170 L110 185 Q85 192 60 185 Z" fill="#7b9e87" stroke="#5a7a68" strokeWidth="1"/>
              {/* Pontos Área 1: colo, axila, abdómen superior */}
              <circle cx="85" cy="62" r="5" fill="#e57373" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="65" cy="70" r="5" fill="#e57373" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="105" cy="70" r="5" fill="#e57373" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="85" cy="100" r="5" fill="#e57373" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="65" cy="128" r="5" fill="#e57373" stroke="#fff" strokeWidth="1.5"/>
              {/* Labels com alturas */}
              <text x="58" y="73" fontSize="6" fill="#fff" fontWeight="700">0</text>
              <text x="58" y="102" fontSize="6" fill="#fff" fontWeight="700">5</text>
              <text x="58" y="130" fontSize="6" fill="#fff" fontWeight="700">10</text>
              <text x="58" y="155" fontSize="6" fill="#fff" fontWeight="700">15</text>
              <text x="58" y="180" fontSize="6" fill="#fff" fontWeight="700">20</text>
            </svg>
            <div style={{ flex: 1 }}>
              <MedidaAreaTable prefix="area1" alturas={5} data={data} handleChange={handleChange} handleBlur={handleBlur} />
            </div>
          </div>
        </div>

        {/* ÁREA 2 — com imagem miniatura lateral */}
        <div style={{ border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', overflow: 'hidden' }}>
          <div style={{ background: '#5a8a7a', color: '#fff', padding: '0.3rem 0.75rem', fontWeight: 700, fontSize: '0.82rem' }}>ÁREA 2</div>
          <div style={{ display: 'flex', gap: '0.75rem', padding: '0.6rem 0.75rem', alignItems: 'flex-start' }}>
            {/* Mini corpo Área 2 */}
            <svg viewBox="55 155 80 115" style={{ width: '60px', flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg">
              <path d="M62 60 Q85 56 108 60 L112 130 Q85 135 58 130 Z" fill="#d4956a" stroke="#c8a882" strokeWidth="1"/>
              <path d="M68 75 Q85 80 102 75 L104 88 Q85 93 66 88 Z" fill="#7b9e87" stroke="#5a7a68" strokeWidth="1"/>
              <path d="M63 130 Q85 135 107 130 L110 185 Q85 190 60 185 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <path d="M62 170 Q85 165 108 170 L110 185 Q85 192 60 185 Z" fill="#7b9e87" stroke="#5a7a68" strokeWidth="1"/>
              <path d="M63 185 Q72 183 78 185 L80 255 Q73 257 66 255 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <path d="M92 185 Q98 183 107 185 L104 255 Q97 257 90 255 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              {/* Pontos Área 2: flancos, culote */}
              <circle cx="63" cy="160" r="5" fill="#81c784" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="107" cy="160" r="5" fill="#81c784" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="67" cy="180" r="5" fill="#ffb74d" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="103" cy="180" r="5" fill="#ffb74d" stroke="#fff" strokeWidth="1.5"/>
              <text x="56" y="163" fontSize="6" fill="#fff" fontWeight="700">0</text>
              <text x="56" y="195" fontSize="6" fill="#fff" fontWeight="700">10</text>
              <text x="56" y="245" fontSize="6" fill="#fff" fontWeight="700">16</text>
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>Direito</div>
              <MedidaAreaTable prefix="area2_dir" alturas={3} data={data} handleChange={handleChange} handleBlur={handleBlur} />
              <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--clr-text-muted)', margin: '0.6rem 0 0.3rem', textTransform: 'uppercase' }}>Esquerdo</div>
              <MedidaAreaTable prefix="area2_esq" alturas={3} data={data} handleChange={handleChange} handleBlur={handleBlur} />
            </div>
          </div>
        </div>

        {/* ÁREA 3 — com imagem miniatura lateral */}
        <div style={{ border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', overflow: 'hidden' }}>
          <div style={{ background: '#5a8a7a', color: '#fff', padding: '0.3rem 0.75rem', fontWeight: 700, fontSize: '0.82rem' }}>ÁREA 3</div>
          <div style={{ display: 'flex', gap: '0.75rem', padding: '0.6rem 0.75rem', alignItems: 'flex-start' }}>
            {/* Mini corpo Área 3 */}
            <svg viewBox="55 175 80 170" style={{ width: '60px', flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg">
              <path d="M63 185 Q72 183 78 185 L80 255 Q73 257 66 255 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <path d="M92 185 Q98 183 107 185 L104 255 Q97 257 90 255 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <ellipse cx="73" cy="257" rx="9" ry="7" fill="#d4a882"/>
              <ellipse cx="97" cy="257" rx="9" ry="7" fill="#d4a882"/>
              <path d="M64 262 Q72 260 79 262 L78 330 Q72 332 65 330 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              <path d="M91 262 Q98 260 106 262 L105 330 Q99 332 92 330 Z" fill="#e8c9a0" stroke="#c8a882" strokeWidth="1"/>
              {/* Pontos Área 3: virilha, perna */}
              <circle cx="72" cy="188" r="5" fill="#4fc3f7" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="98" cy="188" r="5" fill="#4fc3f7" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="72" cy="220" r="5" fill="#4fc3f7" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="98" cy="220" r="5" fill="#4fc3f7" stroke="#fff" strokeWidth="1.5"/>
              <text x="56" y="191" fontSize="6" fill="#333" fontWeight="700">0</text>
              <text x="56" y="222" fontSize="6" fill="#333" fontWeight="700">10</text>
              <text x="56" y="260" fontSize="6" fill="#333" fontWeight="700">20</text>
              <text x="56" y="308" fontSize="6" fill="#333" fontWeight="700">30</text>
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>Direito</div>
              <MedidaAreaTable prefix="area3_dir" alturas={4} data={data} handleChange={handleChange} handleBlur={handleBlur} />
              <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--clr-text-muted)', margin: '0.6rem 0 0.3rem', textTransform: 'uppercase' }}>Esquerdo</div>
              <MedidaAreaTable prefix="area3_esq" alturas={4} data={data} handleChange={handleChange} handleBlur={handleBlur} />
            </div>
          </div>
        </div>

      </div>{/* fim Massagem Avaliativa */}

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
