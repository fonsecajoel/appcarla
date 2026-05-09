import { useStore } from '../store/useStore';

export default function EsculpeDetox({ client }) {
  const { updateClient } = useStore();

  const handleChange = (field, value) => {
    updateClient(client.id, 'esculpeDetox', { [field]: value });
  };

  const data = client.esculpeDetox || {};

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

  const CheckboxGroup = ({ label, field, options }) => (
    <div className="form-group" style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {options.map(opt => (
          <label key={opt} className="checkbox-label">
            <input
              type="checkbox"
              checked={!!(data[field] || []).includes(opt)}
              onChange={(e) => {
                const current = data[field] || [];
                const updated = e.target.checked ? [...current, opt] : current.filter(v => v !== opt);
                handleChange(field, updated);
              }}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );

  const RadioGroup = ({ label, field, options }) => (
    <div className="form-group" style={{ marginBottom: '1rem', background: 'var(--clr-sidebar)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {options.map(opt => (
          <label key={opt} className="checkbox-label">
            <input type="radio" name={field} value={opt} checked={data[field] === opt} onChange={() => handleChange(field, opt)} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );

  const ScoreField = ({ label, field }) => (
    <div className="form-group" style={{ marginBottom: '0.75rem', background: 'var(--clr-sidebar)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
      <label className="checkbox-label" style={{ fontWeight: 500 }}>
        <input type="checkbox" checked={!!data[field]} onChange={(e) => handleChange(field, e.target.checked)} />
        {label}
      </label>
    </div>
  );

  const SectionScore = ({ scoreField }) => (
    <div className="form-group" style={{ marginTop: '0.5rem' }}>
      <label style={{ fontWeight: 700 }}>Pontuação Total</label>
      <input type="number" min="0" value={data[scoreField] || ''} onChange={(e) => handleChange(scoreField, e.target.value)} style={{ maxWidth: '100px' }} />
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

  const contraceptivosOptions = [
    'Pílula', 'Diu (mirena)', 'Diu (cobre)', 'Adesivo', 'Implante', 'Menopausa', 'Nenhum'
  ];

  const acompanhamentoOptions = [
    'Cardiologista', 'Dermatologista', 'Nutrólogo', 'Psicólogo', 'Ginecologista',
    'Personal Trainer', 'Traumatologista', 'Nutricionista', 'Med. Integrativa',
    'Psiquiatra', 'Coach', 'Nenhum destes'
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Método Esculpe Detox</h2>

      <SectionTitle>Informações Pessoais</SectionTitle>
      <div className="grid grid-cols-3 mb-6">
        <Input label="Nome" field="nome" />
        <Input label="Data de Nascimento" field="data_nasc" type="date" />
        <Input label="Idade" field="idade" type="number" />
        <Input label="E-mail" field="email" type="email" />
        <Input label="Instagram" field="instagram" />
        <Input label="Contato" field="contato" />
        <Input label="Profissão" field="profissao" />
        <Input label="Estado Civil" field="estado_civil" />
        <Input label="Filhos" field="filhos" />
        <Input label="Endereço" field="endereco" />
        <Input label="Cidade" field="cidade" />
        <Input label="Estado" field="estado" />
        <Input label="CEP" field="cep" />
        <Input label="Complemento" field="complemento" />
      </div>
      <div className="grid grid-cols-2 mb-6">
        <RadioGroup label="Como nos conheceu?" field="como_conheceu" options={['Facebook', 'Instagram', 'Indicação', 'Outro']} />
        <div className="form-group">
          <label style={{ fontWeight: 600 }}>Conhece alguém que já fez Esculpe Detox?</label>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
            <label className="checkbox-label">
              <input type="radio" name="conhece_alguem" value="sim" checked={data.conhece_alguem === 'sim'} onChange={() => handleChange('conhece_alguem', 'sim')} />
              Sim
            </label>
            <label className="checkbox-label">
              <input type="radio" name="conhece_alguem" value="não" checked={data.conhece_alguem === 'não'} onChange={() => handleChange('conhece_alguem', 'não')} />
              Não
            </label>
          </div>
          {data.conhece_alguem === 'sim' && (
            <input type="text" placeholder="Quem?" value={data.conhece_alguem_quem || ''} onChange={(e) => handleChange('conhece_alguem_quem', e.target.value)} />
          )}
        </div>
      </div>

      <SectionTitle>Informações Gerais</SectionTitle>
      <div className="mb-6">
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Já fez tratamentos estéticos anteriormente?</label>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
            <label className="checkbox-label">
              <input type="radio" name="trat_ant" value="sim" checked={data.trat_ant === 'sim'} onChange={() => handleChange('trat_ant', 'sim')} />
              Sim
            </label>
            <label className="checkbox-label">
              <input type="radio" name="trat_ant" value="não" checked={data.trat_ant === 'não'} onChange={() => handleChange('trat_ant', 'não')} />
              Não
            </label>
          </div>
          {data.trat_ant === 'sim' && (
            <input type="text" placeholder="Qual(is) já fez?" value={data.trat_ant_quais || ''} onChange={(e) => handleChange('trat_ant_quais', e.target.value)} />
          )}
        </div>
        <CheckboxGroup label="Protocolos de interesse" field="protocolos_interesse" options={protocolosOptions} />
      </div>

      <SectionTitle>Anamnese Comportamental</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <RadioGroup label="Sono" field="sono" options={['Menos de 6 horas de sono de qualidade', '6 horas de sono sem qualidade', '8 horas ou mais de sono de qualidade']} />
        <RadioGroup label="Funcionamento do intestino" field="intestino" options={['Todos os dias', '3x ou mais na semana', '1x na semana']} />
        <RadioGroup label="Retenção de líquidos - urinar" field="urina" options={['2x ao dia', 'Mais de 2x ao dia', 'Mais de 5x ao dia']} />
      </div>

      <SectionTitle>Hábitos Alimentares</SectionTitle>
      <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', marginBottom: '1rem' }}>
        Escala: 1 = Não consumo | 2 = Consumo raramente | 3 = Consumo regularmente | 4 = Consumo diariamente
      </p>
      <div className="grid grid-cols-3 mb-6">
        {habitosAlimentaresOptions.map(item => (
          <div key={item} className="form-group">
            <label>{item}</label>
            <select value={data[`hab_${item.toLowerCase().replace(/ /g, '_')}`] || ''} onChange={(e) => handleChange(`hab_${item.toLowerCase().replace(/ /g, '_')}`, e.target.value)}>
              <option value="">-</option>
              <option value="1">1 - Não consumo</option>
              <option value="2">2 - Raramente</option>
              <option value="3">3 - Regularmente</option>
              <option value="4">4 - Diariamente</option>
            </select>
          </div>
        ))}
      </div>

      <SectionTitle>Líquidos</SectionTitle>
      <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', marginBottom: '1rem' }}>
        Escala: 1 = Não consumo | 2 = Consumo raramente | 3 = Consumo regularmente | 4 = Consumo diariamente
      </p>
      <div className="grid grid-cols-3 mb-6">
        {liquidosOptions.map(item => (
          <div key={item} className="form-group">
            <label>{item}</label>
            <select value={data[`liq_${item.toLowerCase().replace(/ /g, '_')}`] || ''} onChange={(e) => handleChange(`liq_${item.toLowerCase().replace(/ /g, '_')}`, e.target.value)}>
              <option value="">-</option>
              <option value="1">1 - Não consumo</option>
              <option value="2">2 - Raramente</option>
              <option value="3">3 - Regularmente</option>
              <option value="4">4 - Diariamente</option>
            </select>
          </div>
        ))}
        <Input label="Quantidade de água diária" field="agua_quantidade" />
      </div>

      <SectionTitle>Atividade Física</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <RadioGroup label="Prática atual" field="atividade_fisica" options={['Nunca praticou', 'Não pratica atualmente', 'Pratica regularmente']} />
        <Input label="Quais atividades?" field="atividade_quais" />
        <Input label="Quantas vezes na semana?" field="atividade_frequencia" />
      </div>

      <SectionTitle>Histórico Diário — Peso</SectionTitle>
      <div className="grid grid-cols-3 mb-6">
        <Input label="Peso atual" field="peso_atual" type="number" />
        <Input label="Peso ideal" field="peso_ideal" type="number" />
        <Input label="Idade atual" field="idade_atual" type="number" />
        <Input label="Com quantos anos estava na melhor versão?" field="idade_melhor" type="number" />
        <Textarea label="O que mudou desde esse período?" field="o_que_mudou" rows={2} />
        <Textarea label="Com quem mora hoje?" field="com_quem_mora" rows={2} />
        <Textarea label="Como é o seu trabalho?" field="trabalho" rows={2} />
        <Textarea label="O que pode resgatar?" field="resgatar" rows={2} />
        <Textarea label="O que precisa deixar?" field="deixar" rows={2} />
        <Textarea label="O que tem deixado de fazer que antes te realizava?" field="deixou_fazer" rows={2} />
        <Textarea label="Meta de transformação" field="meta_transformacao" rows={2} />
      </div>

      <SectionTitle>Referência de Bem-Estar e Estética</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <Input label="Qual idade tinha?" field="ref_idade" type="number" />
        <Textarea label="Com quem morava?" field="ref_com_quem" rows={2} />
        <Textarea label="Como era a sua rotina?" field="ref_rotina" rows={2} />
        <Textarea label="O que mais gostava de fazer?" field="ref_gostava" rows={2} />
      </div>

      <SectionTitle>Métodos Contraceptivos</SectionTitle>
      <CheckboxGroup label="Assinale a opção em uso ou a última que usou" field="contraceptivos" options={contraceptivosOptions} />

      <SectionTitle>Acompanhamento Contínuo</SectionTitle>
      <CheckboxGroup label="Está a ser acompanhada por algum especialista?" field="acompanhamento" options={acompanhamentoOptions} />

      <SectionTitle>Medicação Contínua / Cirurgia</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <Textarea label="Medicação contínua" field="medicacao" rows={2} />
        <Textarea label="Cirurgia (histórico)" field="cirurgia" rows={2} />
      </div>

      <SectionTitle>Avaliação Funcional — Área 1: Stresse</SectionTitle>
      <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', marginBottom: '1rem' }}>Assinale as opções positivas (cada opção vale 1 ponto)</p>
      <div className="grid grid-cols-2 mb-2">
        <ScoreField label="Surtos de fome" field="est_surtos_fome" />
        <ScoreField label="Fadiga constante" field="est_fadiga" />
        <ScoreField label="Alteração de humor" field="est_humor" />
        <ScoreField label="Baixa imunidade" field="est_imunidade" />
        <ScoreField label="Ansiedade" field="est_ansiedade" />
        <ScoreField label="Irritações na pele" field="est_pele" />
        <ScoreField label="Desejo de comer doces" field="est_doces" />
        <ScoreField label="Distúrbio do sono" field="est_sono" />
        <ScoreField label="Depressão" field="est_depressao" />
        <ScoreField label="Pensamento acelerado" field="est_pensamento" />
      </div>
      <SectionScore scoreField="score_stress" />

      <SectionTitle marginTop>Avaliação Funcional — Área 1: Hormonas</SectionTitle>
      <div className="grid grid-cols-2 mb-2">
        <ScoreField label="Se sente cansado o tempo todo" field="hor_cansado" />
        <ScoreField label="Está irritado e mau humorado" field="hor_irritado" />
        <ScoreField label="O sono deixa com sensação de cansaço" field="hor_sono_cansaco" />
        <ScoreField label="Sente-se esgotado no meio da tarde" field="hor_tarde" />
        <ScoreField label="Às vezes sente-se mal sem razão aparente" field="hor_mal" />
        <ScoreField label="Menstruação irregular" field="hor_menstruacao" />
        <ScoreField label="Sofre com cólicas" field="hor_colicas" />
        <ScoreField label="Retém muito líquido durante a menstruação" field="hor_retencao" />
        <ScoreField label="Vontade de comer doces na menstruação" field="hor_doces" />
        <ScoreField label="Irritada/intolerante/ansiosa na menstruação" field="hor_ansiosa" />
      </div>
      <SectionScore scoreField="score_hormonas" />

      <SectionTitle marginTop>Avaliação Funcional — Área 2: Digestão</SectionTitle>
      <div className="grid grid-cols-2 mb-2">
        <ScoreField label="Sente-se estufado logo após comer" field="dig_estufado" />
        <ScoreField label="Gases frequentes pós-refeições" field="dig_gases" />
        <ScoreField label="Cólicas abdominais frequentes" field="dig_colicas" />
        <ScoreField label="Prisão de ventre" field="dig_prisao" />
        <ScoreField label="Cândida crónica" field="dig_candida" />
        <ScoreField label="Diarreia" field="dig_diarreia" />
        <ScoreField label="Azia / Má digestão" field="dig_azia" />
        <ScoreField label="Hemorroidas" field="dig_hemorroidas" />
        <ScoreField label="Dor de cabeça" field="dig_cabeca" />
        <ScoreField label="Unhas fracas" field="dig_unhas" />
      </div>
      <SectionScore scoreField="score_digestao" />

      <SectionTitle marginTop>Avaliação Funcional — Área 2: Inflamação</SectionTitle>
      <div className="grid grid-cols-2 mb-2">
        <ScoreField label="Dores nas articulações" field="inf_articulacoes" />
        <ScoreField label="Inchaço nas articulações" field="inf_inchaco" />
        <ScoreField label="Dor no pescoço, ombros e/ou costas" field="inf_costas" />
        <ScoreField label="Toma muitos remédios para dor" field="inf_remedios" />
        <ScoreField label="Está sempre à espera do pior" field="inf_pior" />
        <ScoreField label="Vontade de comer doces" field="inf_doces" />
        <ScoreField label="Rinite alérgica" field="inf_rinite" />
        <ScoreField label="Dores de cabeça com frequência" field="inf_cabeca" />
        <ScoreField label="Problemas de pele" field="inf_pele" />
        <ScoreField label="Problemas de intestino" field="inf_intestino" />
      </div>
      <SectionScore scoreField="score_inflamacao" />

      <SectionTitle marginTop>Avaliação Funcional — Área 3: Circulação</SectionTitle>
      <div className="grid grid-cols-2 mb-2">
        <ScoreField label="Sofre com palpitações" field="cir_palpitacoes" />
        <ScoreField label="Fica sem ar ao subir escadas" field="cir_ar" />
        <ScoreField label="Formigamento nas mãos ou pés" field="cir_formigamento" />
        <ScoreField label="Põe sal em excesso nos alimentos" field="cir_sal" />
        <ScoreField label="É fumante" field="cir_fumante" />
        <ScoreField label="Sente muita sede" field="cir_sede" />
        <ScoreField label="Urina muito" field="cir_urina" />
        <ScoreField label="Está sempre cansado" field="cir_cansado" />
        <ScoreField label="Tem ou já teve pressão alta" field="cir_pressao" />
        <ScoreField label="Sente-se muito stressado" field="cir_stress" />
      </div>
      <SectionScore scoreField="score_circulacao" />

      <SectionTitle marginTop>Avaliação Funcional — Área 3: Energia</SectionTitle>
      <div className="grid grid-cols-2 mb-2">
        <ScoreField label="Precisa de mais horas de sono" field="ene_sono" />
        <ScoreField label="Sente-se pesado e com preguiça pela manhã" field="ene_preguica" />
        <ScoreField label="Toma muito chá ou café durante o dia" field="ene_cafe" />
        <ScoreField label="Vontade de comer açúcar e/ou carboidrato" field="ene_acucar" />
        <ScoreField label="Evita exercitar-se por estar cansado" field="ene_exercicio" />
        <ScoreField label="Perde a concentração com frequência" field="ene_concentracao" />
        <ScoreField label="Sente-se muito stressado" field="ene_stress" />
        <ScoreField label="Fica muito tempo sentado" field="ene_sentado" />
        <ScoreField label="Sente as pernas pesadas" field="ene_pernas" />
        <ScoreField label="Está mais de 10 kg acima do peso" field="ene_peso" />
      </div>
      <SectionScore scoreField="score_energia" />

      <SectionTitle marginTop>Avaliação Funcional — Área 3: Imunológico</SectionTitle>
      <div className="grid grid-cols-2 mb-2">
        <ScoreField label="Pega resfriado com frequência" field="imu_resfriado" />
        <ScoreField label="Demora para restabelecer-se quando adoece" field="imu_demora" />
        <ScoreField label="É comum sentir-se stressado" field="imu_stress" />
        <ScoreField label="Sofre com depressão ou ansiedade" field="imu_dep" />
        <ScoreField label="Usou antibióticos mais de 1x no último ano" field="imu_antibioticos" />
        <ScoreField label="Tem dores de garganta" field="imu_garganta" />
        <ScoreField label="Dores de cabeça frequentes" field="imu_cabeca" />
        <ScoreField label="Problemas de intestino" field="imu_intestino" />
        <ScoreField label="Alérgico a algum alimento" field="imu_alergia" />
        <ScoreField label="Consome bebidas alcoólicas mais de 3x na semana" field="imu_alcool" />
      </div>
      <SectionScore scoreField="score_imunologico" />

      <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--clr-sidebar)', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)', fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>
        <strong>Legenda:</strong> De 7 a 10 = Prioridade!! | De 4 a 6 = Atenção! | De 1 a 3 = Normal.
      </div>

      <SectionTitle marginTop>Ficha de Acompanhamento — Sessões</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <Input label="Tratamento 1 — Data de início" field="trat1_data" type="date" />
        <Input label="Nº de sessões (Tratamento 1)" field="trat1_nsessoes" type="number" />
        <CheckboxGroup label="Tipo de tratamento 1" field="trat1_tipo" options={protocolosOptions} />
        <Input label="Tratamento 2 — Data de início" field="trat2_data" type="date" />
        <Input label="Nº de sessões (Tratamento 2)" field="trat2_nsessoes" type="number" />
        <CheckboxGroup label="Tipo de tratamento 2" field="trat2_tipo" options={protocolosOptions} />
      </div>

      <SectionTitle>Massagem Avaliativa</SectionTitle>
      <div className="grid grid-cols-2 mb-6">
        <div>
          <h4 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>1º Tratamento</h4>
          <Input label="Data de início" field="mass1_data_inicio" type="date" />
          <Input label="Peso inicial" field="mass1_peso_inicio" type="number" />
          <Input label="Data meio" field="mass1_data_meio" type="date" />
          <Input label="Peso meio" field="mass1_peso_meio" type="number" />
          <Input label="Data final" field="mass1_data_final" type="date" />
          <Input label="Peso final" field="mass1_peso_final" type="number" />
        </div>
        <div>
          <h4 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>2º Tratamento</h4>
          <Input label="Data de início" field="mass2_data_inicio" type="date" />
          <Input label="Peso inicial" field="mass2_peso_inicio" type="number" />
          <Input label="Data meio" field="mass2_data_meio" type="date" />
          <Input label="Peso meio" field="mass2_peso_meio" type="number" />
          <Input label="Data final" field="mass2_data_final" type="date" />
          <Input label="Peso final" field="mass2_peso_final" type="number" />
        </div>
      </div>

      <SectionTitle>Termómetro de Desconforto (escala 0-10)</SectionTitle>
      <div className="grid grid-cols-3 mb-6">
        {['Região de Fígado', 'Região de Baço', 'Região de Intestino', 'Região de Virilha', 'Área Superior', 'Área Central', 'Área Inferior', 'Inferior de Perna'].map(zona => {
          const key = zona.toLowerCase().replace(/[^a-z0-9]/g, '_');
          return (
            <div key={zona} className="form-group">
              <label>{zona}</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="number" placeholder="Início" min="0" max="10" value={data[`term_${key}_inicio`] || ''} onChange={(e) => handleChange(`term_${key}_inicio`, e.target.value)} style={{ width: '80px' }} />
                <input type="number" placeholder="Final" min="0" max="10" value={data[`term_${key}_final`] || ''} onChange={(e) => handleChange(`term_${key}_final`, e.target.value)} style={{ width: '80px' }} />
              </div>
            </div>
          );
        })}
      </div>

      <SectionTitle>Dados de Bioimpedância (Opcional)</SectionTitle>
      <div className="grid grid-cols-3 mb-6">
        <Input label="Índice de massa gorda" field="bio_massa_gorda" />
        <Input label="Índice de massa magra" field="bio_massa_magra" />
        <Input label="Massa muscular" field="bio_muscular" />
      </div>

      <SectionTitle>Pontos Importantes / Orientações</SectionTitle>
      <div className="grid grid-cols-1 mb-6">
        <Textarea label="Pontos importantes da avaliação" field="pontos_importantes" rows={4} />
        <Textarea label="Sugestão de profissionais ou outros realizados na consulta" field="sugestao_profissionais" rows={3} />
        <Textarea label="Orientações sobre mudanças de hábito" field="orientacoes_habito" rows={3} />
      </div>

      <div style={{ padding: '1.5rem', background: 'var(--clr-sidebar)', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-primary)' }}>
        <label className="checkbox-label" style={{ fontWeight: 600 }}>
          <input type="checkbox" checked={!!data.termo_aceito} onChange={(e) => handleChange('termo_aceito', e.target.checked)} />
          Declaro que as afirmações acima são verdadeiras. Li e aceito os termos de responsabilidade.
        </label>
      </div>
    </div>
  );
}
