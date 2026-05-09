import { useStore } from '../store/useStore';

const Input = ({ label, field, type = 'text', value, onChange }) => (
  <div className="form-group">
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
    />
  </div>
);

const CheckboxText = ({ label, fieldCheck, fieldText, checked, textValue, onChange }) => (
  <div className="form-group" style={{ marginBottom: '1.5rem', background: 'var(--clr-sidebar)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
    <label className="checkbox-label" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(fieldCheck, e.target.checked)}
      />
      {label}
    </label>
    {checked && (
      <input
        type="text"
        placeholder="Qual/Quais/Observações?"
        value={textValue}
        onChange={(e) => onChange(fieldText, e.target.value)}
        style={{ marginTop: '0.5rem' }}
      />
    )}
  </div>
);

export default function Anamnese({ client }) {
  const { updateClient } = useStore();

  const handleChange = (field, value) => {
    if (field === 'name') {
      updateClient(client.id, 'name', value);
    } else {
      updateClient(client.id, 'anamnese', { [field]: value });
    }
  };

  const data = client.anamnese || {};

  return (
    <div className="animate-fade-in">
      <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Ficha de Anamnese Corporal</h2>
      
      <h3 style={{ marginBottom: '1rem', color: 'var(--clr-primary)', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>Dados Pessoais</h3>
      <div className="grid grid-cols-3 mb-6">
        <Input label="Data" field="data_ficha" type="date" value={data.data_ficha || ''} onChange={handleChange} />
        <Input label="Nome" field="name" value={client.name} onChange={handleChange} />
        <Input label="Idade" field="idade" type="number" value={data.idade || ''} onChange={handleChange} />
        <div className="form-group">
          <label>Sexo</label>
          <select value={data.sexo || ''} onChange={(e) => handleChange('sexo', e.target.value)}>
            <option value="">Selecione...</option>
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        <Input label="Data de Nascimento" field="data_nasc" type="date" value={data.data_nasc || ''} onChange={handleChange} />
        <Input label="Profissão" field="profissao" value={data.profissao || ''} onChange={handleChange} />
        <Input label="Etnia" field="etnia" value={data.etnia || ''} onChange={handleChange} />
        <Input label="Estado Civil" field="estado_civil" value={data.estado_civil || ''} onChange={handleChange} />
        <Input label="E-mail" field="email" type="email" value={data.email || ''} onChange={handleChange} />
        <Input label="Indicação" field="indicacao" value={data.indicacao || ''} onChange={handleChange} />
        <Input label="Motivo da Visita" field="motivo" value={data.motivo || ''} onChange={handleChange} />
      </div>

      <h3 style={{ marginBottom: '1rem', color: 'var(--clr-primary)', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>Endereço e Contato</h3>
      <div className="grid grid-cols-2 mb-6">
        <Input label="Endereço" field="endereco" value={data.endereco || ''} onChange={handleChange} />
        <Input label="Bairro" field="bairro" value={data.bairro || ''} onChange={handleChange} />
        <Input label="Cidade" field="cidade" value={data.cidade || ''} onChange={handleChange} />
        <Input label="CEP" field="cep" value={data.cep || ''} onChange={handleChange} />
        <Input label="Fone Residencial" field="fone_res" value={data.fone_res || ''} onChange={handleChange} />
        <Input label="Fone Comercial/Celular" field="fone_com" value={data.fone_com || ''} onChange={handleChange} />
      </div>

      <h3 style={{ marginBottom: '1rem', color: 'var(--clr-primary)', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>Em caso de emergência</h3>
      <div className="grid grid-cols-2 mb-6">
        <Input label="Nome Contato" field="emerg_nome" value={data.emerg_nome || ''} onChange={handleChange} />
        <Input label="Telefone Contato" field="emerg_tel" value={data.emerg_tel || ''} onChange={handleChange} />
        <Input label="Médico" field="medico" value={data.medico || ''} onChange={handleChange} />
        <Input label="Telefone Médico" field="medico_tel" value={data.medico_tel || ''} onChange={handleChange} />
        <Input label="Convênio Médico" field="convenio" value={data.convenio || ''} onChange={handleChange} />
        <Input label="Carteirinha / Hospital" field="carteirinha" value={data.carteirinha || ''} onChange={handleChange} />
      </div>

      <h3 style={{ marginBottom: '1rem', color: 'var(--clr-primary)', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>Histórico Clínico e Hábitos</h3>
      <div className="grid grid-cols-2 mb-6">
        <CheckboxText label="Costuma permanecer muito tempo sentada?" fieldCheck="sentada" fieldText="sentada_obs" checked={!!data.sentada} textValue={data.sentada_obs || ''} onChange={handleChange} />
        <CheckboxText label="Antecedentes cirúrgicos?" fieldCheck="cirurgia" fieldText="cirurgia_quais" checked={!!data.cirurgia} textValue={data.cirurgia_quais || ''} onChange={handleChange} />
        <CheckboxText label="Tratamento estético anterior?" fieldCheck="estetico_ant" fieldText="estetico_qual" checked={!!data.estetico_ant} textValue={data.estetico_qual || ''} onChange={handleChange} />
        <CheckboxText label="Antecedentes alérgicos?" fieldCheck="alergia" fieldText="alergia_quais" checked={!!data.alergia} textValue={data.alergia_quais || ''} onChange={handleChange} />
        <CheckboxText label="Funcionamento intestinal regular?" fieldCheck="intestino" fieldText="intestino_obs" checked={!!data.intestino} textValue={data.intestino_obs || ''} onChange={handleChange} />
        <CheckboxText label="Pratica atividade física?" fieldCheck="esporte" fieldText="esporte_quais" checked={!!data.esporte} textValue={data.esporte_quais || ''} onChange={handleChange} />
        <CheckboxText label="É fumante?" fieldCheck="fumante" fieldText="fumante_obs" checked={!!data.fumante} textValue={data.fumante_obs || ''} onChange={handleChange} />
        <CheckboxText label="Alimentação balanceada?" fieldCheck="alimentacao" fieldText="alimentacao_tipo" checked={!!data.alimentacao} textValue={data.alimentacao_tipo || ''} onChange={handleChange} />
        <CheckboxText label="Ingere líquidos com frequência?" fieldCheck="liquido" fieldText="liquido_quanto" checked={!!data.liquido} textValue={data.liquido_quanto || ''} onChange={handleChange} />
        <CheckboxText label="É gestante? / Tem filhos?" fieldCheck="gestante" fieldText="gestante_quantos" checked={!!data.gestante} textValue={data.gestante_quantos || ''} onChange={handleChange} />
        <CheckboxText label="Problema ortopédico?" fieldCheck="ortopedico" fieldText="ortopedico_qual" checked={!!data.ortopedico} textValue={data.ortopedico_qual || ''} onChange={handleChange} />
        <CheckboxText label="Faz algum tratamento médico?" fieldCheck="tratamento" fieldText="tratamento_qual" checked={!!data.tratamento} textValue={data.tratamento_qual || ''} onChange={handleChange} />
        <CheckboxText label="Usa ou já usou ácidos na pele?" fieldCheck="acidos" fieldText="acidos_quais" checked={!!data.acidos} textValue={data.acidos_quais || ''} onChange={handleChange} />
        <CheckboxText label="Já fez algum tratamento ortomolecular?" fieldCheck="ortomolecular" fieldText="ortomolecular_qual" checked={!!data.ortomolecular} textValue={data.ortomolecular_qual || ''} onChange={handleChange} />
        <CheckboxText label="Cuidados Diários e produtos em uso?" fieldCheck="cuidados" fieldText="cuidados_quais" checked={!!data.cuidados} textValue={data.cuidados_quais || ''} onChange={handleChange} />
        <CheckboxText label="Portador de Marcapasso?" fieldCheck="marcapasso" fieldText="marcapasso_obs" checked={!!data.marcapasso} textValue={data.marcapasso_obs || ''} onChange={handleChange} />
        <CheckboxText label="Presença de metais?" fieldCheck="metais" fieldText="metais_local" checked={!!data.metais} textValue={data.metais_local || ''} onChange={handleChange} />
        <CheckboxText label="Antecedentes oncológicos?" fieldCheck="oncologico" fieldText="oncologico_qual" checked={!!data.oncologico} textValue={data.oncologico_qual || ''} onChange={handleChange} />
        <CheckboxText label="Ciclo menstrual regular?" fieldCheck="menstrual" fieldText="menstrual_obs" checked={!!data.menstrual} textValue={data.menstrual_obs || ''} onChange={handleChange} />
        <CheckboxText label="Usa método anticoncepcional?" fieldCheck="anticoncepcional" fieldText="anticoncepcional_qual" checked={!!data.anticoncepcional} textValue={data.anticoncepcional_qual || ''} onChange={handleChange} />
        <CheckboxText label="Varizes?" fieldCheck="varizes" fieldText="varizes_grau" checked={!!data.varizes} textValue={data.varizes_grau || ''} onChange={handleChange} />
        <CheckboxText label="Lesões?" fieldCheck="lesoes" fieldText="lesoes_quais" checked={!!data.lesoes} textValue={data.lesoes_quais || ''} onChange={handleChange} />
        <CheckboxText label="Hipertensão?" fieldCheck="hipertensao" fieldText="hipertensao_obs" checked={!!data.hipertensao} textValue={data.hipertensao_obs || ''} onChange={handleChange} />
        <CheckboxText label="Epilepsia?" fieldCheck="epilepsia" fieldText="epilepsia_obs" checked={!!data.epilepsia} textValue={data.epilepsia_obs || ''} onChange={handleChange} />
        <CheckboxText label="Hipotensão?" fieldCheck="hipotensao" fieldText="hipotensao_obs" checked={!!data.hipotensao} textValue={data.hipotensao_obs || ''} onChange={handleChange} />
        <CheckboxText label="Diabetes?" fieldCheck="diabetes" fieldText="diabetes_obs" checked={!!data.diabetes} textValue={data.diabetes_obs || ''} onChange={handleChange} />
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--clr-sidebar)', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-primary)' }}>
        <h4 style={{ marginBottom: '1rem' }}>Termo de Responsabilidade</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', marginBottom: '1rem' }}>
          Declaro ter sido informada sobre todos os procedimentos, riscos e cuidados necessários para o tratamento estético, assumindo a responsabilidade pelas informações acima prestadas.
        </p>
        <label className="checkbox-label" style={{ fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={!!data.termo_aceito}
            onChange={(e) => handleChange('termo_aceito', e.target.checked)}
          />
          Li e aceito os termos e afirmo que as informações acima são verdadeiras.
        </label>
      </div>
    </div>
  );
}
