import { useState, useEffect, useRef, useCallback } from 'react';
import { storeAPI } from '../store/useStore';

const Input = ({ label, field, type = 'text', value, onChange, onBlur }) => (
  <div className="form-group">
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      onBlur={() => onBlur(field)}
    />
  </div>
);

const CheckboxText = ({ label, fieldCheck, fieldText, checked, textValue, onChange, onBlur }) => (
  <div className="form-group" style={{ marginBottom: '1.5rem', background: 'var(--clr-sidebar)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
    <label className="checkbox-label" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          onChange(fieldCheck, e.target.checked);
          onBlur(fieldCheck);
        }}
      />
      {label}
    </label>
    {checked && (
      <input
        type="text"
        placeholder="Qual/Quais/Observações?"
        value={textValue}
        onChange={(e) => onChange(fieldText, e.target.value)}
        onBlur={() => onBlur(fieldText)}
        style={{ marginTop: '0.5rem' }}
      />
    )}
  </div>
);

export default function Anamnese({ client }) {
  const [localData, setLocalData] = useState({
    name: client.name,
    ...(client.anamnese || {}),
  });

  const clientIdRef = useRef(client.id);

  useEffect(() => {
    if (clientIdRef.current !== client.id) {
      clientIdRef.current = client.id;
      setLocalData({ name: client.name, ...(client.anamnese || {}) });
    }
  }, [client.id]);

  const handleChange = useCallback((field, value) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Only persist to store on blur (not on every keystroke)
  const handleBlur = useCallback((field) => {
    setLocalData((prev) => {
      const value = prev[field];
      if (field === 'name') {
        storeAPI.updateClient(client.id, 'name', value);
      } else {
        storeAPI.updateClient(client.id, 'anamnese', { [field]: value });
      }
      return prev;
    });
  }, [client.id]);

  return (
    <div className="animate-fade-in">
      <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Ficha de Anamnese Corporal</h2>
      
      <h3 style={{ marginBottom: '1rem', color: 'var(--clr-primary)', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>Dados Pessoais</h3>
      <div className="grid grid-cols-3 mb-6">
        <Input label="Data" field="data_ficha" type="date" value={localData.data_ficha || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Nome" field="name" value={localData.name || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Idade" field="idade" type="number" value={localData.idade || ''} onChange={handleChange} onBlur={handleBlur} />
        <div className="form-group">
          <label>Sexo</label>
          <select value={localData.sexo || ''} onChange={(e) => { handleChange('sexo', e.target.value); handleBlur('sexo'); }}>
            <option value="">Selecione...</option>
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        <Input label="Data de Nascimento" field="data_nasc" type="date" value={localData.data_nasc || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Profissão" field="profissao" value={localData.profissao || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Etnia" field="etnia" value={localData.etnia || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Estado Civil" field="estado_civil" value={localData.estado_civil || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="E-mail" field="email" type="email" value={localData.email || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Indicação" field="indicacao" value={localData.indicacao || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Motivo da Visita" field="motivo" value={localData.motivo || ''} onChange={handleChange} onBlur={handleBlur} />
      </div>

      <h3 style={{ marginBottom: '1rem', color: 'var(--clr-primary)', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>Endereço e Contato</h3>
      <div className="grid grid-cols-2 mb-6">
        <Input label="Endereço" field="endereco" value={localData.endereco || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Bairro" field="bairro" value={localData.bairro || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Cidade" field="cidade" value={localData.cidade || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="CEP" field="cep" value={localData.cep || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Fone Residencial" field="fone_res" value={localData.fone_res || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Fone Comercial/Celular" field="fone_com" value={localData.fone_com || ''} onChange={handleChange} onBlur={handleBlur} />
      </div>

      <h3 style={{ marginBottom: '1rem', color: 'var(--clr-primary)', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>Em caso de emergência</h3>
      <div className="grid grid-cols-2 mb-6">
        <Input label="Nome Contato" field="emerg_nome" value={localData.emerg_nome || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Telefone Contato" field="emerg_tel" value={localData.emerg_tel || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Médico" field="medico" value={localData.medico || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Telefone Médico" field="medico_tel" value={localData.medico_tel || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Convênio Médico" field="convenio" value={localData.convenio || ''} onChange={handleChange} onBlur={handleBlur} />
        <Input label="Carteirinha / Hospital" field="carteirinha" value={localData.carteirinha || ''} onChange={handleChange} onBlur={handleBlur} />
      </div>

      <h3 style={{ marginBottom: '1rem', color: 'var(--clr-primary)', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>Histórico Clínico e Hábitos</h3>
      <div className="grid grid-cols-2 mb-6">
        <CheckboxText label="Costuma permanecer muito tempo sentada?" fieldCheck="sentada" fieldText="sentada_obs" checked={!!localData.sentada} textValue={localData.sentada_obs || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Antecedentes cirúrgicos?" fieldCheck="cirurgia" fieldText="cirurgia_quais" checked={!!localData.cirurgia} textValue={localData.cirurgia_quais || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Tratamento estético anterior?" fieldCheck="estetico_ant" fieldText="estetico_qual" checked={!!localData.estetico_ant} textValue={localData.estetico_qual || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Antecedentes alérgicos?" fieldCheck="alergia" fieldText="alergia_quais" checked={!!localData.alergia} textValue={localData.alergia_quais || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Funcionamento intestinal regular?" fieldCheck="intestino" fieldText="intestino_obs" checked={!!localData.intestino} textValue={localData.intestino_obs || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Pratica atividade física?" fieldCheck="esporte" fieldText="esporte_quais" checked={!!localData.esporte} textValue={localData.esporte_quais || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="É fumante?" fieldCheck="fumante" fieldText="fumante_obs" checked={!!localData.fumante} textValue={localData.fumante_obs || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Alimentação balanceada?" fieldCheck="alimentacao" fieldText="alimentacao_tipo" checked={!!localData.alimentacao} textValue={localData.alimentacao_tipo || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Ingere líquidos com frequência?" fieldCheck="liquido" fieldText="liquido_quanto" checked={!!localData.liquido} textValue={localData.liquido_quanto || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="É gestante? / Tem filhos?" fieldCheck="gestante" fieldText="gestante_quantos" checked={!!localData.gestante} textValue={localData.gestante_quantos || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Problema ortopédico?" fieldCheck="ortopedico" fieldText="ortopedico_qual" checked={!!localData.ortopedico} textValue={localData.ortopedico_qual || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Faz algum tratamento médico?" fieldCheck="tratamento" fieldText="tratamento_qual" checked={!!localData.tratamento} textValue={localData.tratamento_qual || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Usa ou já usou ácidos na pele?" fieldCheck="acidos" fieldText="acidos_quais" checked={!!localData.acidos} textValue={localData.acidos_quais || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Já fez algum tratamento ortomolecular?" fieldCheck="ortomolecular" fieldText="ortomolecular_qual" checked={!!localData.ortomolecular} textValue={localData.ortomolecular_qual || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Cuidados Diários e produtos em uso?" fieldCheck="cuidados" fieldText="cuidados_quais" checked={!!localData.cuidados} textValue={localData.cuidados_quais || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Portador de Marcapasso?" fieldCheck="marcapasso" fieldText="marcapasso_obs" checked={!!localData.marcapasso} textValue={localData.marcapasso_obs || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Presença de metais?" fieldCheck="metais" fieldText="metais_local" checked={!!localData.metais} textValue={localData.metais_local || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Antecedentes oncológicos?" fieldCheck="oncologico" fieldText="oncologico_qual" checked={!!localData.oncologico} textValue={localData.oncologico_qual || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Ciclo menstrual regular?" fieldCheck="menstrual" fieldText="menstrual_obs" checked={!!localData.menstrual} textValue={localData.menstrual_obs || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Usa método anticoncepcional?" fieldCheck="anticoncepcional" fieldText="anticoncepcional_qual" checked={!!localData.anticoncepcional} textValue={localData.anticoncepcional_qual || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Varizes?" fieldCheck="varizes" fieldText="varizes_grau" checked={!!localData.varizes} textValue={localData.varizes_grau || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Lesões?" fieldCheck="lesoes" fieldText="lesoes_quais" checked={!!localData.lesoes} textValue={localData.lesoes_quais || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Hipertensão?" fieldCheck="hipertensao" fieldText="hipertensao_obs" checked={!!localData.hipertensao} textValue={localData.hipertensao_obs || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Epilepsia?" fieldCheck="epilepsia" fieldText="epilepsia_obs" checked={!!localData.epilepsia} textValue={localData.epilepsia_obs || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Hipotensão?" fieldCheck="hipotensao" fieldText="hipotensao_obs" checked={!!localData.hipotensao} textValue={localData.hipotensao_obs || ''} onChange={handleChange} onBlur={handleBlur} />
        <CheckboxText label="Diabetes?" fieldCheck="diabetes" fieldText="diabetes_obs" checked={!!localData.diabetes} textValue={localData.diabetes_obs || ''} onChange={handleChange} onBlur={handleBlur} />
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--clr-sidebar)', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-primary)' }}>
        <h4 style={{ marginBottom: '1rem' }}>Termo de Responsabilidade</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', marginBottom: '1rem' }}>
          Declaro ter sido informada sobre todos os procedimentos, riscos e cuidados necessários para o tratamento estético, assumindo a responsabilidade pelas informações acima prestadas.
        </p>
        <label className="checkbox-label" style={{ fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={!!localData.termo_aceito}
            onChange={(e) => { handleChange('termo_aceito', e.target.checked); handleBlur('termo_aceito'); }}
          />
          Li e aceito os termos e afirmo que as informações acima são verdadeiras.
        </label>
      </div>
    </div>
  );
}
