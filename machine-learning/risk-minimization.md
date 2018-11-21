# Risk Minimization

## Structural risk minimization

## Empirical risk minimization

# Annotation

## Automatic Extaction

ChestX-ray14

胸片，来自3万多位患者。

14，就代表这些胸片里，总共包含了14种肺部疾病。

每一张胸片都要标注，是根据医生的放射学报告，用自动提取 (Automatic Extaction) 的方法来标注的。

训练过程分两步

算法是由多个神经网络集合而成。


第一步，由于是自动标注，所以要解决标签部分不正确 (Partially Incorrect) 的问题。

具体方法是，先让这些神经网络，在数据集里训练14种疾病的预测。然后用它们做出的预测，来重新标注数据集。

第二步，再拿一个新的神经网络集合，在新标注的数据集上训练。这次训练完成，AI就可以去诊断疾病了
