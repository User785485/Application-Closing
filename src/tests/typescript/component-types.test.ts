/**
 * Ce fichier contient des tests TypeScript statiques pour vu00e9rifier
 * que les composants sont correctement typu00e9s.
 * Ces "tests" ne sont pas exu00e9cutu00e9s mais compilent, ce qui vu00e9rifie la validitu00e9 des types.
 */

import React from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

// Test des types du Button
function testButtonTypes() {
  // Tous ces tests devraient compiler sans erreur
  const validButtons = [
    // Tailles valides
    <Button size="xs">XS Button</Button>,
    <Button size="sm">SM Button</Button>,
    <Button size="md">MD Button</Button>,
    <Button size="lg">LG Button</Button>,
    
    // Variantes valides
    <Button variant="primary">Primary</Button>,
    <Button variant="secondary">Secondary</Button>,
    <Button variant="success">Success</Button>,
    <Button variant="danger">Danger</Button>,
    <Button variant="outline">Outline</Button>,
    <Button variant="ghost">Ghost</Button>,
    
    // Autres props
    <Button isLoading>Loading</Button>,
    <Button disabled>Disabled</Button>,
    <Button fullWidth>Full Width</Button>,
    <Button leftIcon={<span>Icon</span>}>With Left Icon</Button>,
    <Button rightIcon={<span>Icon</span>}>With Right Icon</Button>,
  ];

  return validButtons;
}

// Test des types invalides (ces commentaires doivent produire des erreurs TypeScript)
/*
// @ts-expect-error - Taille invalide
const invalidSizeButton = <Button size="xxl">Invalid Size</Button>;

// @ts-expect-error - Variante invalide
const invalidVariantButton = <Button variant="non-existent">Invalid Variant</Button>;
*/

// Test des types du Card
function testCardTypes() {
  // Test de l'interface CardComponent
  const validCards = [
    // Card de base
    <Card className="p-4">
      Content
    </Card>,
    
    // Card avec sous-composants
    <Card>
      <Card.Header>
        <h3>Card Title</h3>
      </Card.Header>
      <Card.Body>
        Card Content
      </Card.Body>
      <Card.Footer>
        Footer
      </Card.Footer>
    </Card>,
    
    // Card avec className sur tous les u00e9lu00e9ments
    <Card className="main-card">
      <Card.Header className="card-header">
        Header
      </Card.Header>
      <Card.Body className="card-body">
        Body
      </Card.Body>
      <Card.Footer className="card-footer">
        Footer
      </Card.Footer>
    </Card>,
  ];

  return validCards;
}

// Export des fonctions de test pour u00e9viter les warning de "unused"
export { testButtonTypes, testCardTypes };
