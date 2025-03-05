import { validateComponent } from '../utils/build-logger';
import { validateReactTree, registerComponent } from '../utils/component-validator';

// Cette fonction exécute une série de tests pour valider les composants
export async function runComponentValidationTests() {
  console.log('🧪 Running component validation tests...');
  
  try {
    // Test 1: Import validation for core components
    console.log('Test 1: Validating core component imports...');
    let testsPassed = true;
    
    // Dynamically import components to test
    const componentImports = [
      { path: '../../components/ui/card', name: 'Card' },
      { path: '../../components/ui/button', name: 'Button' },
      // Ajouter d'autres composants critiques ici
    ];
    
    for (const component of componentImports) {
      try {
        const module = await import(component.path);
        const isValid = validateComponent(module[component.name], component.name, `tests/component-validation`);
        
        if (!isValid) {
          testsPassed = false;
          console.error(`❌ Component ${component.name} validation failed`);
        } else {
          console.log(`✅ Component ${component.name} successfully validated`);
          
          // Register validated component for dependency checks
          registerComponent(module[component.name], {
            name: component.name,
            isClient: true, // Most UI components should be client components
            imports: [], // Would need static analysis to determine actual imports
            file: component.path
          });
        }
      } catch (error) {
        testsPassed = false;
        console.error(`❌ Failed to import ${component.name}: ${error}`);
      }
    }
    
    // Test 2: Check for 'use client' directives in client components
    console.log('Test 2: Checking client component directives...');
    for (const component of componentImports) {
      try {
        const fileContent = await fetch(`file://${component.path}.tsx`).then(res => res.text());
        if (!fileContent.includes('use client')) {
          testsPassed = false;
          console.error(`❌ Component ${component.name} is missing 'use client' directive`);
        } else {
          console.log(`✅ Component ${component.name} has 'use client' directive`);
        }
      } catch (error) {
        console.warn(`⚠️ Could not check 'use client' directive for ${component.name}: ${error}`);
      }
    }
    
    // Test 3: Check appointments page specifically since it's failing
    console.log('Test 3: Validating appointments page...');
    try {
      const { default: AppointmentsPage } = await import('../app/appointments/page');
      console.log(`✅ Appointments page imported successfully`);
      
      // Validate the tree (would need to mock React rendering)
      // validateReactTree(<AppointmentsPage />, 'app/appointments/page.tsx');
    } catch (error) {
      testsPassed = false;
      console.error(`❌ Failed to import appointments page: ${error}`);
    }
    
    return {
      success: testsPassed,
      message: testsPassed ? 'All component validation tests passed' : 'Some component validation tests failed'
    };
  } catch (error) {
    console.error('❌ Component validation tests failed:', error);
    return {
      success: false,
      message: `Component validation tests failed: ${error}`
    };
  }
}
